// Import necessary libraries and components
import React, { useState, useEffect } from "react";
import {
  Button,
  TableSortLabel,
  Stack,
  Pagination,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { parseISO, format } from 'date-fns';
import GuestInfoModal from "./GuestInfoModal";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const ArchiveTable = () => {
  // Initialize state variables
  const [data, setData] = useState([]);
  const [isGuestInfoModalOpen, setIsGuestInfoModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderBy, setOrderBy] = useState();
  const [order, setOrder] = useState('asc');
  const rowsPerPage = 8;
  const pageCount = Math.ceil(appointments.length / rowsPerPage);
  const currentPageData = appointments.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const fetchMyAppointments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/fetch-my-appointments", {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data.rows);
      }
    } catch (error) {
      console.error("Unable to fetch appointments", error);
    }
  };

  const handleButtonClick = (appointmentId) => {
    const appointment = appointments.find((a) => a.id === appointmentId);
    setData(appointment);

    if (data) {
      setIsGuestInfoModalOpen(true);
      console.log(appointment.id);
    }
  };

  const handleSort = (property) => {
  const isAsc = orderBy === property && order === 'asc';
  setOrderBy(property);
  setOrder(isAsc ? 'desc' : 'asc');
  const sortedAppointments = [...appointments].sort((a, b) => {
    if (a[property] < b[property]) {
      return isAsc ? -1 : 1;
    }
    if (a[property] > b[property]) {
      return isAsc ? 1 : -1;
    }
    return 0;
  });
  setAppointments(sortedAppointments);
};

  useEffect(() => {
    fetchMyAppointments();
  },[])
  
  return (
  <React.Fragment>
    <GuestInfoModal
      isOpen={isGuestInfoModalOpen}
      onRequestClose={() => setIsGuestInfoModalOpen(false)}
      selectedAppointment={data}
    />
    <Container
    sx={{
      backgroundColor: "white",
        width: "100vh",
        height: "100%",
        borderRadius: "5px",
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: '100%',
      }}
      >
      <h1
        style={{
          fontSize: '25px',
          color: "black",
          textAlign: "center",
          paddingTop: "10%",
          paddingBottom: "5%"
        }}
      >
        Arkisto
      </h1>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>

              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "date"}
                  direction={order}
                  onClick={() => handleSort("date")}
                >
                  Päiväys
                </TableSortLabel>
                </TableCell>
              <TableCell align="center">Nimi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
            <TableRow key={appointment.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="center">{format(parseISO(appointment.date), 'M/d/yyyy')}</TableCell>
              <TableCell align="center">{appointment.guest_firstname} {appointment.guest_lastname}</TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
        <Stack>
          <Pagination count={pageCount} page={currentPage} onChange={(event, value) => setCurrentPage(value)}/>
        </Stack>
      </TableContainer>
      </Container>
    </React.Fragment>
    )
};

export default ArchiveTable;
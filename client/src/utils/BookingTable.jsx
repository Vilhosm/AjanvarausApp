// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { parseISO, format, differenceInDays } from 'date-fns';
import GuestBookingModal from "./GuestBookingModal";
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Stack,
  Button,
  Pagination,
} from "@mui/material";

import "../index.css";
import "../components/Public/styles/styles.css";
import incrementAppointments from '../hooks/incrementAppointment';



export default function BasicTable({ date }) {
  // Initialize state varaibles
  const [order, setOrder] = useState("asc");
  const [selectedDate, setSelectedDate] = useState();
  const [dateFormat, setDateFormat] = useState();
  const [isGuestBookingModalOpen, setIsGuestBookingModalOpen] = useState(false);
  const [id, setId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [appointments, setAppointments] = useState([]);
  const [tableMargin, setTableMargin] = useState(handleTableMargin());

  const rowsPerPage = 8;
  const pageCount = Math.ceil(appointments.length / rowsPerPage);
  const currentPageData = appointments.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage); 

  const weekdays = ["Sunnuntai","Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai"];

  // Effect hook to handle date change
  useEffect(() => {
    if (date) {
      const timeZone = 'Europe/Helsinki';
  
      // Convert the date to Helsinki timezone
      const localDate = utcToZonedTime(date, timeZone);
      const formattedDate = format(localDate, "yyyy-MM-dd");
      setDateFormat(formattedDate);
  
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const currentUtcDate = zonedTimeToUtc(currentDate, timeZone);
  
      const daysDifference = differenceInDays(localDate, currentUtcDate);
      // Text display for booking table
      let displayText;
      if (daysDifference === 0) {
        displayText =  `Tänään ${format(localDate, "d.M")}`;
      } else if (daysDifference === 1) {
        displayText = `Huomenna ${format(localDate, "d.M")}`;
      } else if (daysDifference === 2) {
        displayText = `Ylihuomenna ${format(localDate, "d.M")}`;
      } else {
        displayText = `${weekdays[localDate.getDay()]} ${format(localDate, "d.M")}`;
      }
      setSelectedDate(displayText);
    };
  }, [date]);
  

  // Fetch appointments when dateFormat is set
  useEffect(() => {
    if (dateFormat) {
      fetchAppointments();
    }
  }, [dateFormat]);

  // Resize listener which detatches on unmount
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {  
      window.removeEventListener('resize', handleResize);
    };
  });
  // Function to fetch appointments
  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/fetch-by-date', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: dateFormat }),
      });
      if (response.ok) {
        const data = await response.json();
        const sortedAppointments = data.rows.sort((a, b) => {
          if (a.date < b.date) {
            return order === 'asc' ? -1 : 1;
          }
          if (a.date > b.date) {
            return order === 'asc' ? 1 : -1;
          }
          if (a.start_time < b.start_time) {
            return order === 'asc' ? -1 : 1;
          }
          if (a.start_time > b.start_time) {
            return order === 'asc' ? 1 : -1;
          }
          return 0;
        });   
        setAppointments(sortedAppointments);
      }
    } catch (error) {
      console.error('Error ocurred in fetching appointments', error);
    }
  };
  // Function to book appointments
  const bookAppointment = async (guestFirstname, guestLastname, guestPhone, guestEmail, information, teacherId) => {
    try {
      const response = await fetch('http://localhost:5000/api/reserve-appointment', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guestFirstname,
          guestLastname,
          guestPhone,
          guestEmail,
          information,  
          teacherId: id
        }),
      });

      if (response.ok) {
        // Refresh appointments after a successful booking
        console.log('Appointment booked succesfully');
        setIsGuestBookingModalOpen(false);
        incrementAppointments(id);
        fetchAppointments();
      } else {
        const error = await response.json();
        console.error("Error booking appointment", error);
      }
    }catch (error) {
      console.error("Error ocurred in bookAppointment", error);
    }
  };
  // Function to format time
  const formatTime = (start_time, end_time) => {
    
  };

  // Function to handle resize
  function handleResize() {
    setTableMargin(handleTableMargin());
  };

  // Calculate margin based on window width
  function handleTableMargin() {
    if (window.innerWidth < 800 && window.innerWidth > 600) {
      return '14%';
    }
    return 'auto';  
  };

  return (
    <>
      <GuestBookingModal
        isOpen={isGuestBookingModalOpen}
        onRequestClose={() => setIsGuestBookingModalOpen(false)}
        onSubmit={bookAppointment}
      />  
    <Box>
      <TableContainer component={Paper} sx={{
        width: "100%",
        marginTop: -5,
        marginLeft: handleTableMargin,
        marginRight: handleTableMargin
      }}
      > 
        <p style={{ textAlign: 'center', fontSize: '20px' }}>
          {selectedDate}
        </p>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align='center'>Aika</TableCell>
              <TableCell align="center">Päivämäärä</TableCell>
              <TableCell align="center" >Nimi</TableCell>
              <TableCell align="center">Varaa aika</TableCell>
            </TableRow>
          </TableHead>
            <TableBody>
            {currentPageData.map((row, index) => (
              <React.Fragment key={index}>
                <TableRow
                  className='TimeFont'
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope='row'>
                    <div style={{  display: "flex", flexDirection: "column", alignItems: "center" }}> 
                      <AccessTimeIcon fontSize='large'/>
                      {row.start_time} - { row.end_time }
                    </div>  
                  </TableCell>
                  <TableCell align="center">{format(parseISO(row.date), 'd.M')}</TableCell>
                  <TableCell align="center">{row.teacher_firstname} {row.teacher_lastname}</TableCell>
                  <TableCell align='center'>
                    <Button variant='contained'
                      onClick={() => {
                      setId(row.teacher_id);
                      setIsGuestBookingModalOpen(true);
                    }} sx={{
                      width: "100px",
                      backgroundColor: "rgba(0, 0, 0, 0.87)",
                      color: "white",
                      ":hover": { backgroundColor: "rgba(0,0,0,0.87)" }
                    }}>Varaa
                    </Button>
                  </TableCell>  
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        <Stack>
          <Pagination count={pageCount} page={currentPage} onChange={(event, value) => setCurrentPage(value)}
          />
        </Stack>
      </TableContainer>  
    </Box>
    </>
  );
}
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
  TableRow,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  Grid
} from "@mui/material";

import { parseISO, format } from 'date-fns';
import GuestInfoModal from "./GuestInfoModal";

import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const theme = createTheme();

const AdminTable = () => {
  // Initialize state variables
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [data, setData] = useState([]);
  const [isGuestInfoModalOpen, setIsGuestInfoModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderBy, setOrderBy] = useState();
  const [order, setOrder] = useState('asc');
  const rowsPerPage = 8;
  const pageCount = Math.ceil(appointments.length / rowsPerPage);

  useEffect(() => {
    fetchMyAppointments();
  },[]);

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

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const displayTime = (startTime, endTime) => {
    
    return "";
  };

  const handleButtonClick = (appointmentId) => {
    const appointment = appointments.find((a) => a.id === appointmentId);
    setData(appointment);

    if (data) {
      setIsGuestInfoModalOpen(true);
    }
  };

  const handleDialogClose = () => {
    setIsConfirmDialogOpen(false);
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/delete-appointment/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        handleDialogClose();
        setSnackbarOpen(true);
        fetchMyAppointments();
      }
    } catch (error) {
      console.error("Could not delete the appontment", error);
    }
  };
  // Function to sort appoinments by date
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

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="lg">
        <CssBaseline />
    <GuestInfoModal
      isOpen={isGuestInfoModalOpen}
      onRequestClose={() => setIsGuestInfoModalOpen(false)}
      selectedAppointment={data}
    />
    <Box
     sx={{
      marginTop: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
     }}
    >
      <Typography component="h1" variant="h5" sx={{ marginBottom: 5 }}>
        Varaukset
      </Typography>
      <Grid item xs={12}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell align="center"></TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "start_time"}
                  direction={order}
                  onClick={() => handleSort('start_time')}
                >
                  Aika
                </TableSortLabel>
                </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === "date"}
                  direction={order}
                  onClick={() => handleSort("date")}
                >
                  Päivämäärä 
                </TableSortLabel>
                </TableCell>
              <TableCell align="center">Nimi</TableCell>
            </TableRow>
            {appointments.map((appointment) => (
            <TableRow key={appointment.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="center"
                >
                  <Button variant="contained"
                    onClick={() => {handleButtonClick(appointment.id)}}
                  >
                    Lisätietoja
                  </Button>
                </TableCell>
                <TableCell component="th" scope='row'>
                  <AccessTimeIcon fontSize='large'/>
                  {displayTime(appointment.start_time, appointment.end_time)}
                  {appointment.start_time} - {appointment.end_time}  
              </TableCell>
              <TableCell align="center">{format(parseISO(appointment.date), 'M/d/yyyy')}</TableCell>
              <TableCell align="center">{appointment.guest_firstname} {appointment.guest_lastname}</TableCell>
              <TableCell align="center">
                <Button variant="outlined" color="error" startIcon={<DeleteIcon />} 
                  onClick={() => {
                    setIsConfirmDialogOpen(true); 
                  }}
                >Peru aika
                </Button>
              </TableCell>
                <Dialog
                  open={isConfirmDialogOpen}
                  onClose={handleDialogClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"Vahvista peruutus"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Haluatko varmasti poistaa tämän ajan?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setIsConfirmDialogOpen(false)} color="primary">
                      Peru
                    </Button>
                    <Button onClick={() => handleDeleteAppointment(appointment.id)} color="primary">
                      Poista
                    </Button>
                  </DialogActions>
                </Dialog> 
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </Grid>
        <Stack>
          <Pagination count={pageCount} page={currentPage} onChange={(event, value) => setCurrentPage(value)}/>
        </Stack>
      </Box>
      <Snackbar
        open={snackbarOpen}s
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Aika poistettu
        </Alert>
      </Snackbar>
      </Container>
    </ThemeProvider>
    )
};

export default AdminTable;
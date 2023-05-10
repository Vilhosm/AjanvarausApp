import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { format, addMonths, differenceInMinutes } from "date-fns";
import "./styles/adminBookings.css";
import "react-datepicker/dist/react-datepicker.css";
import AdminNavbar from "../../utils/AdminNavbar";
import fi from "date-fns/locale/fi";

import {
  Box,
  Alert,
  Snackbar,
  Grid,
  Typography
}from "@mui/material";


// Calendar language pack
registerLocale('fi', fi)

const AdminBookings = () => {
  // Initialize state variables
  const [success, setSuccess] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [userData, setUserData] = useState({ id: "", firstname: "", lastname: "" });
  const[error, setError] = useState(null);

  useEffect(() => {
    // Get the user's data from the local storage and store it in the state
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserData({ id: data.id, firstname: data.firstname, lastname: data.lastname });
      }
    } catch (error) {
      console.error("Failed to fetch the user's id", error);
    }
  };
  // Function to filter the passed time
  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    if (
      selectedDate.getFullYear() === currentDate.getFullYear() &&
      selectedDate.getMonth() === currentDate.getMonth() && 
      selectedDate.getDate() === currentDate.getDate()
    ) {
      return currentDate.getTime() < selectedDate.getTime();
    }
    return true;
  };

  // Setting values
  const handleStartDateChange = (date) => {
    setStartDate(date)
  };

  const handleStartTimeChange = (time) => {
    setStartTime(time);
  }

  const handleEndTimeChange = (time) => {
    setEndTime(time);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

     // Format the startTime and endTime values before sending the request
     const formattedDate = format(startDate, "yyyy-MM-dd")
    const formattedStartTime = format(startTime, "HH:mm");
    const formattedEndTime = format(endTime, "HH:mm");
    try {

      const timeDifference = differenceInMinutes(endTime, startTime);
      // Calculates the difference in time
      if (timeDifference < 10) {
        return setError("Appointment cannot last for less than 10 minutes.");
      };

      const response = await fetch('http://localhost:5000/api/create-appointment', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId: userData.id,
          teacherFirstname: userData.firstname,
          teacherLastname: userData.lastname,
          date: formattedDate,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
        }),
        credentials: "include",
      });

      if (response.status === 200) {
        setSuccess(true);
        setStartDate(new Date());
        setStartTime(new Date());
        setEndTime(new Date());
      } else {
        const error = await response.json();
        setError(error.message);
      }
    } catch (error) {
      console.error(error);
      setError("Server error, Please try again later.");
    }
  }
  return (
  <React.Fragment>
    <Grid
    container
    direction="column"
    justifyContent="center"
    alignItems="center"
    >
    <Grid item>
      <AdminNavbar />
    </Grid>
    <Grid item>
      <Typography component="h1" variant="h5"
      sx={{marginBottom: 5, marginTop: 5, color: "gray"}}>
        Luo aikoja
      </Typography>
    </Grid>
    <Grid item xs={12}>
    <Box className="admin-bookings-container">
        {error && <div className="error" style={{
          color: "red", fontSize: "20px", marginBottom: 30, fontFamily: "sans-serif"
        }}>{error}</div>}
        <div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="startDate">Pvm</label>
              <DatePicker
                id="startDate"
                selected={startDate}
                onChange={handleStartDateChange}
                minDate={new Date()}
                maxDate={addMonths(new Date(), 6)}
                filterTime={filterPassedTime}
                timeFormat="HH:mm"
                dateFormat="MMMM d, yyyy"
                locale="fi"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="startTime">Aloitus</label>
              <DatePicker 
                id="startTime"
                selected={startTime}
                onChange={handleStartTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeFormat="HH:mm"
                timeIntervals={10}
                dateFormat="HH:mm"
                locale="fi"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endTime">Lopetus</label>
              <DatePicker
                id="endTime"
                selected={endTime}
                onChange={handleEndTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeFormat="HH:mm"
                timeIntervals={10}
                dateFormat="HH:mm"
                locale="fi"
                required
              />
            </div>
            <button type="submit"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.87)",
              color: "white",
            }}
            >Luo aika
            </button>
          </form>
        </div>
      </Box>
      </Grid>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
        Aika luotu
        </Alert>
      </Snackbar>
    </Grid>
  </React.Fragment>
  );
};

export default AdminBookings;
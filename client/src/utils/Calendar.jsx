// Import necessary libraries and components
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../components/Public/styles/styles.css";

const BookingCalendar = ({ onDateChange }) => {
    // Initialize state variables
    const [appointments, setAppointments] = useState([]);
    const [days, setDays] = useState([]);
    const [value, setValue] = useState(new Date());
    const today = new Date();
    
    // Prevents user from going back years or months.
    const minDate = () => {
        return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 1);
    };
    // Returns last day of the year 
    const maxDate = () => {
        return new Date(today.getFullYear(), 11, 31);
    };
    // Function to set the tile green if date is found
    const tileClass = ({ date, view }) => {
        if (view === "month") {
            const dateString = date.toISOString().substring(0, 10);   
            const isSelectedDate = date.getTime() === value.getTime();
            if (isSelectedDate) {
                return "selected-date";
            } else if (days.includes(dateString)) {
                return "green-tile";
            }
        };
        return null;
    };

    // Function to handle date change when date clicked
    const handleDateChange = (newValue) => {
        setValue(newValue);
        onDateChange(newValue);
    };
    // Function to fetch appointments
    const fetchAppointments = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/fetch-appointments', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setAppointments(data);

                // Date formatting
                const theDates = data.rows.map((row) => {
                    const date = new Date(row.date);
                    return date.toISOString().substring(0, 10);
                });
                setDays(theDates);
            }
        } catch (error) {
            console.error("Unable to fetch appointments", error);
        }
    };  
    // Initialize onDateChange with the default value
    useEffect(() => {
        if (onDateChange) {
            onDateChange(value);
        }
    });
    // Effect hook to fetch appointments
    useEffect(() => {
        fetchAppointments();
    }, []);
    
    return (
        <React.Fragment>
            <Box>
                <Calendar
                className="custom-calendar"
                onChange={handleDateChange}
                value={value}
                locale="fi"
                minDate={minDate()}
                maxDate={maxDate()}
                tileClassName={tileClass}
            />
            <Box sx={{ marginTop: "1%", display: "flex", fontFamily: "sans-serif", textAlign: "center" }}>
                <Box sx={{ backgroundColor: "#1087ff", width: "20px", height: "20px", marginRight: "1%" }} />
                <Box sx={{ marginRight: "5%" }}>Valittu päivä</Box>
                <Box sx={{ backgroundColor: "#ffff76", width: "20px", height: "20px", marginRight: "1%" }} />
                <Box>Tämä päivä</Box>
                <Box sx={{ backgroundColor: "#dfd", width: "20px", height: "20px", marginRight: "1%" }} />
                <Box sx={{ marginRight: "5%" }}>Vapaita aikoja</Box>
            </Box>
        </Box>
        </React.Fragment>
    )
};

export default BookingCalendar;
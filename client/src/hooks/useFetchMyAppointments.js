// Import necessary libraries and components
import React, { useState } from 'react'

// Hook to fetch booked appointments
const useFetchMyAppointments = () => {
    // Initialize state variables
    const [appointments, setAppointments] = useState([]);
    
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
            console.error("Could not fetch my appointments", error);
        }
    };
    return { fetchMyAppointments, appointments }
};

export default useFetchMyAppointments

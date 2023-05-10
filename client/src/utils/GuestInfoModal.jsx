// Import necessary libraries and components
import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";

function GuestInfoModal({ isOpen, onRequestClose, selectedAppointment }) {
    const [id, setId] = useState("");
    const [data, setData] = useState([]);

    const fetchInformation = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/fetch-appointment-extra`, {
                method: 'GET',
            });
            if (response.ok) {
                const data = await response.json();
                setData(data.rows);
                console.log(data);
            }
        } catch (error) {
            console.error("Error ocurred in fetch information", error);
        }
    };

    return (
        <React.Fragment>
            <Dialog open={isOpen} onClose={onRequestClose}>
                { selectedAppointment && (
                <>
                    <DialogTitle>Viesti</DialogTitle>
                    <DialogContent sx={{ fontSize: "20px" }} >{selectedAppointment.information}</DialogContent>
                </>
            )}
            </Dialog>
        </React.Fragment>
    );
};

export default GuestInfoModal;
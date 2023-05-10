// Import necessary libraries and components
import React, { useState } from "react";

import {
    Dialog,
    FormControl,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    FormHelperText,
    Alert,
    Snackbar
  } from "@mui/material/";

const EmailChangeModal = ({ isOpen, onRequestClose, onSubmit, userId }) => {
    // Initialize state variables
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");

    const handleSubmit = async (emailNew, emailConfirm) => {
        try {
            const response = await fetch('http://localhost:5000/api/change-user-email', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    email: emailNew,
                    emailConfirm: emailConfirm,
                    id: userId,
                })
            });
            if (response.ok) {
                const data = await response.json();
                setSuccess(true);
                console.log("Succesfully changed email");
                console.log(data);
                setErrorMessage("");
                onRequestClose();
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <React.Fragment>    
            <Dialog open={isOpen} onClose={onRequestClose} maxWidth="sm" fullWidth>
                <DialogTitle>Vaihda sähköposti</DialogTitle>
                <DialogContent>
                    <form
                    >
                        <FormControl fullWidth margin="normal">
                            <TextField  
                            label="Uusi sähköposti"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                            label="Vahvista sähköposti"
                            value={confirmEmail}
                            onChange={(e) => setConfirmEmail(e.target.value)}
                            />
                        </FormControl>
                        {errorMessage && (
                            <FormHelperText error>{errorMessage}</FormHelperText>
                        )}
                        <Button variant="contained" sx={{ marginTop: "1%" }}
                        onClick={() => handleSubmit(newEmail, confirmEmail)}
                        >SEND
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
            <Snackbar
                open={success}
                autoHideDuration={6000}
                onClose={() => setSuccess(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={() => setSuccess(false)} severity="success">
                    Sähköposti vaihdettu
                </Alert>
            </Snackbar>    
        </React.Fragment>
    );
};

export default EmailChangeModal;
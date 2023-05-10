// Import necessary libraries and components
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import axios from "axios";
import './styles/contactForm.css';
// Function to allow the user to fill up information and book an appointment
const ContactForm = ({ open, onClose }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Initialize variables
      const firstname = document.getElementById('firstname').value;
      const lastname = document.getElementById('lastname').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const extraInformation = document.getElementById('extra-information').value;

      const response = await axios.post('http://localhost:5000/api/reserved-appointments', {
        firstname,
        lastname,
        email,
        phone,
        extraInformation,
      });

      console.log(response.data);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Täytä yhteystiedot</DialogTitle>
      <DialogContent>
        <Box component="form" className="contact-form">
          <Box className="name-fields">
            <Box className="form-field">
              <label htmlFor="firstname">Etunimi:</label>
              <input type="text" id="firstname" name="firstname" />
            </Box>
            <Box className="form- field">
              <label htmlFor='lastname'>Sukunimi:</label>
              <input type="text" id='lastname' name='lastname' />
            </Box>
          </Box>
          <Box className="contact-fields">
            <Box className="form-field">
              <label htmlFor="email">Sähköposti:</label>
              <input type="email" id="email" name="email" />
            </Box>
          </Box>
          <Box className="form-field">
            <label htmlFor='extra-information'>Lisätietoja</label>
            <textarea id='extra-information' name='extra-information' />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactForm;

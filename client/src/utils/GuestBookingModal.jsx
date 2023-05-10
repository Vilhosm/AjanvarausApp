// Import necessary libraries and components
import React, { useState } from 'react';
import {
  Dialog,
  FormControl,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from "@mui/material/";
  
function GuestBookingModal({ isOpen, onRequestClose, onSubmit, selectedAppointment }) {
  // Initialize state variables
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [information, setInformation] = useState('');

  return (
    <Dialog open={isOpen} onClose={onRequestClose}>
      <DialogTitle>Yhteystiedot</DialogTitle>
      {selectedAppointment && (
        <div style={{ alignSelf: 'flex-end', marginRight: '25px' }}>
          Päivämäärä: {" "}
          {new Date(selectedAppointment.date).toLocaleDateString()}
        </div>
      )}
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(firstname, lastname, phone, email, information); 
          }}
        >
          <FormControl fullWidth margin="normal">
            <TextField
              label="Etunimi"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Sukunimi"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
            <FormControl fullWidth margin='normal'>
              <TextField
                label="Puhelin"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </FormControl>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Sähköposti"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>
          <FormControl fullWidth margin='normal'>
            <TextField
              label="Lisätietoja"
              type='information'
              value={information}
              onChange={(e) => setInformation(e.target.value)}
              required
            >
            </TextField>
          </FormControl>
          <DialogActions>
            <Button type="submit" variant="contained" color="primary">
              Varaa
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default GuestBookingModal;

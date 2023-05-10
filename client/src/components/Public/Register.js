// Import necessary libraries and components
import React, { useState } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const theme = createTheme();

export default function Register() {
  // Initialize state variables
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Valid email format
  const isValidEmail = (email) => {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,}$/;
    return regex.test(email);
  }
  // Valid password format
  const isValidPassword = (password) => {
    const minLength = 5;
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    return password.length >= minLength && hasLowerCase && hasUpperCase && hasNumber;
  };
  // Submit function to handle user registration
  // and input validation
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isValidEmail(email)) {
      alert("Please enter a valid email");
      return;
    }
    if (!isValidPassword(password)) {
      alert("Password must be atleast 5 characters long, have atleast one upper and lowercase letter, and one number");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:5000/register', {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        confirmPassword, confirmPassword,
      }).then((response) => {
        navigate('/login');
      }).catch((err) => {
        console.log(err);
      })
    } catch (error) {
      console.error('Error ocurred in sending user information', error);
    } 
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="ConfirmPassword"
                  type="password"
                  id="confirmPpassword"
                  autoComplete="new-confirmPassword"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
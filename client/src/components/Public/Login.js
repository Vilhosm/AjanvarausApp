// Import necessary libraries and components
import React, {  useState } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container
} from "@mui/material";

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useSignIn } from 'react-auth-kit';
import { Formik, Form, Field, useFormik } from "formik";
import * as yup from 'yup';

const validationSchema = yup.object({
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string('Enter your password')
    .required('Password is required'),
});

const theme = createTheme();

export default function Login(props: any) {
  // Initialize variables
  const signIn = useSignIn();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onSubmit = async (values: any) => {
    console.log('Values: ', values);

    try { 
      const response = await axios.post(
        'http://localhost:5000/login',
        values,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      // Create identity for the user
      signIn({
        token: response.data.token,
        expiresIn: 3600,
        tokenType: 'Bearer',
        authState: { email: values.email, role: response.data.role, firstname: response.data.firstname, id: response.data.id },
      });

      if (response.status === 200 && response.data.role === 'admin') {
        const token = response.data.token;
        localStorage.setItem('token', token);
        console.log('Admin login');
        navigate('/admin-bookings');
      } else {
        console.log('Guest login');
        navigate('/');
      }
      
    } catch (error) {
      console.error(error);
      setError("Invalid email or password");
    }
  }
  
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit,
    validationSchema: validationSchema,
  });

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
          {error && (
            <Typography component="p" variant="body1" color="error">
              {error}
            </Typography>
          )}
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={formik.handleSubmit}
          >
            {({ errors, touched, handleChange, values }) => (
              <Form>
                <Field
                  as={TextField}
                  name="email"
                  label="Email Address"
                  autoComplete="email"
                  autoFocus
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  fullWidth
                  margin="normal"
                  required
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
                <Field
                  as={TextField}
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  fullWidth
                  margin="normal"
                  required
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  />
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link variant="body2">
                        Forgot password?
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link href="/Register" variant="body2">
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Box>
        </Container>
      </ThemeProvider>
    );
}    
        

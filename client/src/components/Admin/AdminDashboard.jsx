import React from "react";
import AdminTable from "../../utils/AdminTable";
import AdminNavbar from "../../utils/AdminNavbar";

import {
  Grid,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Container
} from "@mui/material";

const theme = createTheme();

const AdminDashboard = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Grid item xs={12}>
          <AdminNavbar />
        </Grid>
        <Grid item xs={12}>  
          <AdminTable />
        </Grid>
      </Container>
    </ThemeProvider>
  );
};
export default AdminDashboard;

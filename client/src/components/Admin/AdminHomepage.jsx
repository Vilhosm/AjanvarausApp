import React, { useState } from 'react';
import "../Public/styles/styles.css";
import {
  Grid
} from '@mui/material';

import Calendar from '../../utils/Calendar';
import BookingsTable from "../../utils/BookingTable";
import Navbar from '../../utils/AdminNavbar';

const AdminHomepage = () => {
  // Initialize state variables
  const [date, setDate] = useState(new Date());

  return (
    <React.Fragment>
        <Grid
          container
          gap={10}
          spacing={0}
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item>
            <Navbar />
          </Grid>
          <Grid item>
            <Calendar onDateChange={setDate}/>
          </Grid>
          <Grid item>
            <BookingsTable date={date} />
          </Grid>
        </Grid>
    </React.Fragment>
  );
}

export default AdminHomepage;
// Import necessary libraries and components
import React, { useState } from "react";
import "../Public/styles/styles.css";
import {
  Grid,
} from "@mui/material";

import Calendar from "../../utils/Calendar";
import BookingsTable from "../../utils/BookingTable";
import GuestNavbar from "../../utils/GuestNavbar";

const Homepage = () => {
  const [date, setDate] = useState(new Date());
  return (
    <React.Fragment>
      <Grid
        container
        gap={5}
        spacing={0}
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item>
          <GuestNavbar />
        </Grid>
        <Grid item>
          <Calendar onDateChange={setDate} />
        </Grid>
        <Grid item> 
            <BookingsTable date={date}/>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Homepage;

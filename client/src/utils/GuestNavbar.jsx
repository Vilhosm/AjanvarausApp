// Import necessary libraries and components
import React, { useEffect, useState } from "react";
import "../components/Public/styles/styles.css";

import {
  Avatar,
  List,
  Box,
  Drawer,
  ListItem,
  ListItemText
} from "@mui/material";

const GuestNavbar = () => {
  // Initialize state variables
  const [drawerWidth, setDrawerWidth] = useState(getDrawerWidth());

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  function handleResize() {
    setDrawerWidth(getDrawerWidth());
  };

  function getDrawerWidth() {
    return window.innerWidth < 960 ? '20%' : '11%';
  };

  return (
    <React.Fragment>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#ffffff",
            alignItems: "center",
            fontSize: "1.1em"
          }
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "100px",
            paddingBottom: "60px",
          }}
        >
          <Avatar
            sx={{ width: "80px", height: "80px", backgroundColor: "blue" }}
            src="https://sasky.fi/wp-content/themes/sasky/dist/images/sasky-logo.svg"
            alt="Brand Logo"
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "8px",
            }}
          >
          </Box>
        </Box>
        <List>
          <ListItem button component="a" href="https://sasky.fi">
            <ListItemText primary="Kotisivu"/>
          </ListItem>
        </List>
      </Drawer>
    </React.Fragment>
  );
};

export default GuestNavbar;

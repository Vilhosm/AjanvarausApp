// Import necessary libraries and components
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";

// Material-UI imports
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    Box,
    Avatar,
    Badge,
    Popover
} from "@mui/material";
import useFetchUserData from "../hooks/useFetchUserData";
import MailIcon from "@mui/icons-material/Mail";

const Navbar = () => {
    // Initialize state variables
    const { userData, avatar, fetchUserData } = useFetchUserData();
    const navigate = useNavigate();
    const singOut = useSignOut();
    const [drawerWidth, setDrawerWidth] = useState(getDrawerWidth());
    
    const [anchorEl, setAnchorEl] = useState(null);
    
    useEffect(() => {
        fetchUserData();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    }

    const openPopover = Boolean(anchorEl);
    const popoverId = openPopover ? "simple-popover" : undefined;

    function handleResize() {
        setDrawerWidth(getDrawerWidth());
    };

    function getDrawerWidth() {
        return window.innerWidth < 960 ? '20%' : '11%';
    };

    // Logout function, clears out the cookies
    // then redirects to login page
    const handleLogout = () => {
        singOut()
        .then(() => {
            navigate('/login');
        })
        .catch((error) => {
            console.error('Error ocurred in handleLogout function', error);
        });
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
                    fontSize: "1.1em",
                }
            }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: "50%",
                }}>
                    <Badge color="primary"
                    sx={{
                        alignSelf: "flex-end",
                        paddingBottom: "2%"
                    }}>
{/*                         <MailIcon
                        color="action"
                        onClick={handlePopoverOpen}
                        sx={{
                            ":hover": {
                                transform: "scale(1.1)",
                                cursor: "pointer",
                            },
                        }}
                        /> */}
                    </Badge>
                    <Popover
                        id={popoverId}
                        open={openPopover}
                        anchorEl={anchorEl}
                        onClose={handlePopoverClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center'
                        }}
                    >
                        <Box sx={{
                            padding: 2,
                        }}>
                            <p>Sinulle on varattu uusia aikoja!</p>
                        </Box>
                    </Popover>
                    <Avatar 
                    sx={{ width: '80px', height: '80px', backgroundColor: '#61dafb' }}
                    src={avatar} alt="Profile Picture" />
                    <p>
                        {userData.firstname} {userData.lastname}
                    </p>
                </Box>
                <List sx={{ marginTop: "20%" }}>
                <ListItem button component="a" href="http://localhost:3000/">
                        <ListItemText primary="Koti"/>
                    </ListItem>
                    <ListItem button component="a" href="http://localhost:3000/admin-dashboard">
                        <ListItemText primary="Varatut ajat"/>
                    </ListItem>
                    <ListItem button component="a" href="http://localhost:3000/admin-bookings">
                        <ListItemText primary="Vapaat ajat"/>
                    </ListItem>
                    <ListItem button component="a" href="http://localhost:3000/admin-profile">
                        <ListItemText primary="Profiili"/>
                </ListItem>
                <ListItem button onClick={handleLogout}>
                    <ListItemText primary="Kirjaudu ulos" />
                </ListItem>
                </List>
            </Drawer>
        </React.Fragment>
    )
};

export default Navbar;
// Import necessary libraries and components
import React, { useEffect, useState} from "react";
import axios from "axios";
import AdminNavbar from "../../utils/AdminNavbar";
import QuickEditTable from "../../utils/QuickEditTable";
import LoginEditTable from "../../utils/LoginEditTable";

import {
  Grid,
  Box,
  Avatar,
  Button
} from "@mui/material";
import EmailChangeModal from "../../utils/EmailChangeModal";

const AdminProfile = (props) =>  {
  // Initialize state variables
  const [emailEdit, setEmailEdit] = useState(false);
  const [userId, setUserId] = useState();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    const input = document.createElement("input");
    input.type="file";
    input.accept="image/*";
    input.style.display = "none";

    input.onchange = (event) => {
      setSelectedFile(event.target.files[0]);
      uploadImage(event);
      document.body.removeChild(input); // remove the input element after file is selected
    };
    document.body.appendChild(input); // add input element to the DOM
    input.click();
  };
  // Function to upload avatar
  const uploadImage = async (event) => {
    const formData = new FormData();
    formData.append('selectedFile', selectedFile);
    try {
      const response = await axios('http://localhost:5000/api/upload-avatar', {
        method: 'POST',
        data: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200) {
        setAvatarUrl(response.data.url);
      }

    } catch (error) {
      console.error(error);
    }
  }
  // Function to fetch active user
  const fetchUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserId(data.id);
      }
    } catch (error) {
      console.error('Error fetching avatar', error);
    }
  };
  // Function to fetch the avatar assosciated with the user
  const fetchAvatar = async (userId) => {
    try {
      const avatarUrl = `http://localhost:5000/api/avatar/${userId}`;
      setAvatarUrl(avatarUrl);
    } catch (error) {
      console.error('Error fetching avatar', error);
    }
  }

  const handleEmailEdit = () => {
    setEmailEdit(!emailEdit);
  };
  // Effect hook to fetch user
  useEffect(() => {
    fetchUser();
  }, []);
  // Effect hook to fetch user avatar if id found
  useEffect(() => {
    if (userId) {
      fetchAvatar(userId);
    }
  }, [userId]);

  return (
    <React.Fragment>
      <Grid
      container
      direction="column"
      justifyContent="center"
      >
        <Grid item>
          <AdminNavbar />
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="space-around"
          spacing={2}
          sx={{ marginTop: "4%", width: "auto" }}
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Button onClick={handleFileSelect}>
              Lataa kuva
            </Button>
          <Avatar
            src={avatarUrl}
            alt="Profile Picture"
            sx={{
              width: "120px",
              height: "120px",
            }}>
          </Avatar>
          </Box>
          </Grid>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="space-around"
          marginTop="2%"
          gap="5%"
          >            
          <Box sx={{
            textAlign: "center",
            minWidth: 300,
            fontWeight: 600,
            fontSize: "20px",

            }}>Muuta tietoja
          <QuickEditTable />
          </Box>
          <Grid>
          <Box sx={{
            textAlign: "center",
            minWidth: 300,
            fontWeight: 600,
            fontSize: "20px",
          }}>Vaihda salasana
          <LoginEditTable />
          </Box>
          </Grid>
          <Grid sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
            <Box
              sx={{
                textAlign: "center",
                minWidth: 300,
                fontWeight: 600,
                fontSize: "20px",
              }}>
                Vaihda sähköposti
            </Box>
            <Button variant="contained" sx={{
              marginTop: "5%",
              backgroundColor: "rgba(0, 0, 0, 0.87)",
              ":hover": { backgroundColor: "rgba(0, 0, 0, 0.87)" }
            }}
            onClick={() => handleEmailEdit()}
            >
              Vaihda sähköposti
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {emailEdit  && (
        <EmailChangeModal
          isOpen={emailEdit}
          onRequestClose={handleEmailEdit}
          userId={userId}
        />
      )}
    </React.Fragment>
  );
};

export default AdminProfile;
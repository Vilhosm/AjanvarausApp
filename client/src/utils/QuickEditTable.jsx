// Import necessary libraries and components
import { 
  Table,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Alert,
  Snackbar
} from "@mui/material";
import React, { useEffect, useState } from "react";

import EditIcon from '@mui/icons-material/Edit';


const QuickEditTable = () => {
  // Initialize state variables
  const [success, setSuccess] = useState();
  const [rows, setRows] = useState([]); 
  const [editing, setEditing] = useState(false);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");

  // Function to handle changed values
  const handleSave = async (firstname, lastname, phone, id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/save-changes/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          firstname: firstname !== "" ? firstname : undefined,
          lastname: lastname !== "" ? lastname : undefined,
          phone: phone !== "" ? phone : undefined,
          id: id,
        }),
      });
      if (response.ok) {
        setSuccess(true);
        const data = await response.json();
        console.log(data);
        setFirstname("");
        setLastname("");
        setPhone(""); 
        fetchUserData();
        setEditing(false);
      };
    } catch (error) {
      console.error("Could not update user data", error);
    }
  };
  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user-information', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json(); 

        if (data.rows[0].id === undefined) {
          return;
        }
        setRows(data.rows);
      }
    } catch (error) {
      console.error("Could not fetch user data", error);
    }
  };
  // Effect hook to fetch user data
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <React.Fragment>
      <Table sx={{ minWidth: 200, borderRadius: "10px",}} aria-label="simple table">
        <TableBody>
          {rows.map((row) => (
            <React.Fragment key={row.id}>
              <TableRow>
                <TableCell>
                  {!editing ? (
                    <React.Fragment>
                    <EditIcon onClick={() => setEditing(true)} 
                    sx={{ 
                      paddingLeft: "5%",
                      ":hover": { transform: "scale(1.2)", cursor: "pointer"} }}
                    />
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell align="left">Etunimi:</TableCell>
                          <TableCell>{row.firstname}</TableCell>
                        </TableRow> 
                        <TableRow>
                          <TableCell align="left">Sukunimi:</TableCell>
                          <TableCell>{row.lastname}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="left">Puhelin:</TableCell>
                        <TableCell>{row.phone}</TableCell>
                      </TableRow>   
                      </TableBody>
                    </Table>
                    </React.Fragment>
                  ) : (
                  <React.Fragment>
                    <Button variant="contained" onClick={() => handleSave(firstname, lastname, phone, row.id)}
                    sx={{
                      marginRight: 10,
                      backgroundColor: "rgba(0, 0, 0, 0.87)",
                      width: 100,
                      ":hover": { backgroundColor: "rgba(0, 0, 0, 0.87)" }
                    }}
                    >Tallenna muutokset
                    </Button>
                    <Button onClick={() => setEditing(false)} sx={{
                      fontWeight: 700
                    }}>
                      Peru
                    </Button>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell align="left">Etunimi:</TableCell>
                          <TableCell>
                            <TextField sx={{ width: "10em", height: "auto" }}
                              placeholder={row.firstname}
                              onChange={(e) => setFirstname(e.target.value)}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="left">Sukunimi:</TableCell>
                          <TableCell>
                            <TextField sx={{ width: "10em", height: "auto" }}
                              placeholder={row.lastname}
                              onChange={(e) => setLastname(e.target.value)}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="left">Puhelin</TableCell>
                          <TableCell>
                            <TextField sx={{ width: "10em", height: "auto" }}
                              placeholder={row.phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </TableCell>  
                        </TableRow>
                      </TableBody>
                    </Table>
                  </React.Fragment> 
                  )}
                </TableCell>
                </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <Snackbar
      open={success}
      autoHideDuration={6000}
      onClose={() => setSuccess(false)}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Muutokset tallennettu
        </Alert>
      </Snackbar>
    </React.Fragment>
  )
};

export default QuickEditTable;
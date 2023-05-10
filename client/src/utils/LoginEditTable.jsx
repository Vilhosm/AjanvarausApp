// Import necessary libraries and components
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    TextField,
    Box,
    Alert,
    Snackbar
} from "@mui/material";

const LoginEditTable = () => {
    // Initialize state variables
    const [success, setSuccess] = useState(false);
    const [rows, setRows] = useState([]);
    const [passwordEdit, setPasswordEdit] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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

    const savePassword = async (currentPassword, newPassword, confirmPassword, id) => {
        try {
            const response = await fetch('http://localhost:5000/api/user-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword,
                    userId: id,
                }),
            });
            if (response.ok) {
                console.log("response ok!");
                setPasswordEdit(false);
                setSuccess(true);

            }
        } catch (error) {
            console.error("Could not save password", error);
        }
    } ;


    useEffect(() => {
        fetchUserData();
    }, []);

    return (
    <React.Fragment>
        <Table sx={{ minWidth: 200, borderRadius: "10px",  }} aria-label='simple table'>
            <TableBody>
                {rows.map((row) => (
                    <React.Fragment key={row.id}>
                        {!passwordEdit ? (
                        <TableRow>
                            <TableCell>
                                <React.Fragment>
                                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                                        <Button variant='contained' onClick={() => setPasswordEdit(true)}
                                            sx={{
                                                fontSize: "12px",
                                                width: "10em",
                                                justifyContent: "center",
                                                height: "4em",
                                                overflow: "hidden",
                                                backgroundColor: "rgba(0, 0, 0, 0.87)",
                                                ":hover": { backgroundColor: "rgba(0, 0, 0, 0.87)" }
                                            }}
                                        >Vaihda salasana
                                        </Button>
                                    </Box>
                                </React.Fragment>
                            </TableCell>
                        </TableRow>
                        ) : (
                            <React.Fragment>
                                <TableRow>
                                    <TableCell align='left'>Nykyinen salasana</TableCell>
                                    <TableCell>
                                        <p onClick={() => setPasswordEdit(false)}>
                                            <Button variant='contained' sx={{
                                                backgroundColor: "rgba(0, 0, 0, 0.87)",
                                                ":hover": { backgroundColor: "rgba(0, 0, 0, 0.87)" }
                                            }}>
                                                Peru
                                            </Button>
                                            </p>
                                        <TextField sx={{ width: "10em", height: "auto" }}
                                            placeholder='Nykyinen salasana'
                                            type="password"
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align='left'>Uusi salasana</TableCell>
                                    <TableCell>
                                        <TextField sx={{ width: "10em", height: "auto" }}
                                            placeholder='Uusi salasana'
                                            type="password"
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />    
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align='left'>Vahvista salasana</TableCell>
                                    <TableCell>
                                        <TextField sx={{ width: "auto", height: "auto" }}
                                            placeholder='Vahvista salasana'
                                            type="password"
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                    <Button variant='outlined'
                                        onClick={() => savePassword(currentPassword, newPassword, confirmPassword, row.id)}
                                    >
                                        Tallenna muutokset
                                    </Button>
                                    </TableCell>
                                    
                                </TableRow>
                            </React.Fragment>
                        )}
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
            Salasana vaihdettu
        </Alert>  
        </Snackbar>
    </React.Fragment>
  );
}

export default LoginEditTable
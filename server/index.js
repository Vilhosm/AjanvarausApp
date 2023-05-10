  const express = require('express');
  const mysql = require('mysql2');
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
  const cors = require('cors');
  const cookieParser = require('cookie-parser');
  const cron = require('node-cron');
  const multer = require('multer');

  require('dotenv').config();

  const app = express();
  const port = process.env.PORT || 5000;

  const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "auth_db2"
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use(cookieParser());

  db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      role VARCHAR(255) NOT NULL,
      firstname VARCHAR(255) NOT NULL,
      lastname VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(255),
      avatar BLOB,
      appointments INT NOT NULL
    )`, ((err, result) => {
      if (err) {
        return console.error('Unable to create Users table', err);
      } 
  }));

  db.query(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INT PRIMARY KEY AUTO_INCREMENT,
      teacher_id INT NOT NULL,
      teacher_firstname VARCHAR(255) NOT NULL,
      teacher_lastname VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      start_time VARCHAR(255) NOT NULL,
      end_time VARCHAR(255) NOT NULL,
      guest_firstname VARCHAR(50) NOT NULL,
      guest_lastname VARCHAR(50) NOT NULL,
      guest_email VARCHAR(255) NOT NULL,
      guest_phone VARCHAR(20),
      information TEXT,
      FOREIGN KEY (teacher_id) REFERENCES users(id)
    )`, ((err, result) => {
      if (err) {
        return console.error("Unable to create appointments table.", err);
      }
      console.log("appointments table created succesfully");
  }));

  db.query(`
    CREATE TABLE IF NOT EXISTS reserved_appointments (
      id INT PRIMARY KEY AUTO_INCREMENT,
      teacher_id INT NOT NULL,
      teacher_firstname VARCHAR(255) NOT NULL,
      teacher_lastname VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      start_time VARCHAR(255) NOT NULL,
      end_time VARCHAR(255) NOT NULL,
      guest_firstname VARCHAR(50) NOT NULL,
      guest_lastname VARCHAR(50) NOT NULL,
      guest_email VARCHAR(255) NOT NULL,
      guest_phone VARCHAR(20),
      information TEXT
    )`, ((err, result) => {
      if (err) {
        return console.error("Unable to create appointments table.", err);
      }
      console.log("reserved_appointments table created succesfully");
  }));
  // User validation
  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token not found' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Couldnt verify the token', err });
      } 
      req.user = user;
      next();
    })
  };
  // Avatar file size
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB
    },
  });
  // Increments the appointment count when appointment is booked
  app.put('/api/increment-appointments', authenticateToken, async (req, res) => {
    try {
      const { id } = req.body;

      const [rows] = await db.promise().query(`UPDATE users SET appointments = appointments + 1
      WHERE id = ?`, [id]);
      
      return res.status(200).json({ message: "Appointments incremented succesfully", rows });
    } catch (error) {
      return res.status(500).json({ error: "Appointments could not be incremented", error });
    }
  });
  // Function to change users email
  app.put('/api/change-user-email',authenticateToken, async (req, res) => {
    try {
      const { email, emailConfirm, id } = req.body;
      console.log(req.body);

      function checkEmails(email, emailConfirm) {
        const emailRegex = /^\S+@\S+\.\S+$/;

        if (!emailRegex.test(email) || !emailRegex.test(emailConfirm)) {
          return false;
        }
        return true;
      }

      if (!checkEmails(email, emailConfirm)) {
        console.log('Email validation failed:', { email, emailConfirm });
        return res.status(400).json({ error: "Virheellinen sähköposti" });
      }

      const [rows] = await db.promise().query(`
      UPDATE users SET email = ? WHERE id = ?  
      `, [email, id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ message: "Email changed successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Error ocurred in 'api/change-user-email'",  });
    }
  });
  // Function to fetch appointments by date
  app.post('/api/fetch-by-date', async (req, res) => {
    try {
      const { date } = req.body;
  
      const [rows] = await db.promise().query(`
        SELECT start_time, end_time, teacher_id, teacher_firstname, teacher_lastname, date FROM
        appointments WHERE date = ?
      `, [date]);

      return res.status(200).json({ message: "Dates fetched succesfully", rows });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error ocurred in fetch-by-date", error });
    }
  });
  // Function to upload user avatar
  app.post('/api/upload-avatar', authenticateToken, upload.single('selectedFile'), async(req, res) => {
    try {
      // Get the user ID from the authenticate token
      const userId = req.user.userId
      // Get the avatar image data from the request
      const avatarData = req.file.buffer;

      // Save the avatar image data to the database
      const [result] = await db.promise().query(`UPDATE users SET avatar = ? WHERE id = ?`, [avatarData, userId]);

      return res.status(200).json({ message: "Avatar uploaded succesfully", result });
    }catch (error) {
      console.error('Could not upload avatar', error);
      return res.status(500).json({ error: "Error happened in /api/avatar" });
    }
  });
  // Function to fetch users avatar by id
  app.get('/api/avatar/:userId', async(req, res) => {
    try {
      const userId = req.params.userId;
      const [rows] = await db.promise().query(`
        SELECT avatar FROM users WHERE id = ?
      `, [userId]);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const avatarData = rows[0].avatar;

      res.set('Content-Type', 'image/jpeg'); // Set the content type based on the image format you're using
      return res.send(avatarData);

    } catch (error) {
      console.error("Error ocurred fetching avatar", error);
      return res.status(500).json({ error: "Error ocurred in '/api/avatar/:userId'" });
    }
  });
  // Function to update the users information by id
  app.put('/api/update-user/:id', authenticateToken, async (req, res) => {
    try {
      const {  id } = req.params;
      const { firstname, lastname, email, phone } = req.body;

      const [result] = await db.promise().query(`
        UPDATE USERS SET firstname = ?, lastname = ?, email = ?, phone = ? WHERE id = ?
      `, [firstname, lastname, email, phone, id]);

      return res.status(200).json({ message: "User information updated succesfully" });
    } catch (error) {
      console.error('Could not update user data', error);
      return res.status(500).json({ error: "Error ocurred in '/api/update-user'" });
    }
  });

  app.get('/api/user', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.userId;
      const [rows] = await db.promise().query('SELECT * FROM users WHERE id = ?', [userId]);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' }); 
      }

      const user = rows[0];
      return res.status(200).json({ id: user.id, firstname: user.firstname, lastname: user.lastname, });
    } catch (error) {
      console.error('Couldnt find the user',error);
      return res.status(500).json({ error: 'Error happened in /api/user' });
    }
  });

  app.get('/api/user-information', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.userId;

      const [rows] = await db.promise().query(`
        SELECT * from USERS where id = ?
      `,[userId]);

      return res.status(200).json({ message: "Rows fetched succesfully", rows});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Served error ocurred" });
    }
  });

  // Register a new user
  app.post('/register', async (req, res) => {
    try {
      const { firstname, lastname, email, password, confirmPassword } = req.body;

      // Check if user already exists
      const [rows] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
      
      if (rows.length > 0) {
        return res.status(409).json({ error: 'User already exists' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert the new user into the database
      const [result] = await db.promise().query(`INSERT INTO users (role, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)`, ['guest', firstname, lastname, email, hashedPassword]);

      // Create a JWT token for the user
      const token = jwt.sign({ userId: result.insertId }, process.env.JWT_SECRET || 'secret');

      // Set the token in a cookie and send a JSON response
      res.cookie('token', token, {
        httpOnly: true,
        secure: 'production',
        sameSite: 'strict'
      });

      return res.status(200).json({ message: "Registered successfully", token, role: 'guest', firstname, id: result.insertId });

    } catch (error) {
      console.error("Error ocurred in server", error);
      return res.status(500).json({ error: 'Server error' });
    }
  });


  // Login user
  app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const [rows] = await db.promise().query('SELECT * FROM users WHERE email = ?',[email]);
      
      if (rows.length === 0) {
        return res.status(401).json({ error: 'Email does not exist' });
      }

      // Compare the password
      const match = await bcrypt.compare(password, rows[0].password);

      if (!match) {
        return res.status(401).json({ error: 'Invalid credentials', errorMsg });
      }

      // Create a JWT token for the user
      const token = jwt.sign({  userId: rows[0].id }, process.env.JWT_SECRET || 'secret');

      res.cookie('token', token, {
        httpOnly: true,
        secure: 'production',
        sameSite: 'strict'
      });

      return res.status(200).json({ message: "Logged in successfully", token, role: rows[0].role, firstname: rows[0].firstname, lastname: rows[0].lastname, id: rows[0].id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  });


  // Get the user information for the user table
  app.get('/api/get-admin-profile/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const [rows] = await db.promise().query('SELECT * FROM users WHERE id = ?', [id]);
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(rows[0], 'hello from server');
    } catch (error) {
      console.error("Error in /api/get-admin-profile:", error);
      return res.status(500).json({ error: 'Error fetching user information' });
    }
  });

  // Create available appointments
  app.post('/api/create-appointment', async(req, res) => {
    try {
      const { adminId, teacherFirstname, teacherLastname, date, startTime, endTime } = req.body;


      const [exists] = await db.promise().query(`
        SELECT * from appointments WHERE date = ? AND
        start_time = ? AND end_time = ? 
      `, [date, startTime, endTime]);

      if (exists.length > 0) {
        return res.status(403).json({ message: 'Appointment already exists!' });
      }

      const [rows] = await db.promise().query(`
        INSERT INTO appointments (teacher_id, teacher_firstname, teacher_lastname, date, start_time, end_time)
        VALUES (?, ?, ?, ?, ?, ?)
        `, [ adminId, teacherFirstname, teacherLastname, date, startTime, endTime]
      
      );
      return res.status(200).json(rows);  

    }catch (error) {
      console.error("Error ocurred in /api/create-appointment", error);
    }
  });
  // Logout function. Clears cookies
  app.post('/logout', async (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: 'production', sameSite: 'strict' });
    res.status(200).json({ message: 'Logged out succesfully' });
  });

  // Fetch available appointments
  app.get('/api/fetch-appointments', async(req, res) => {
    try {
      const [rows] = await db.promise().query(`
        SELECT teacher_id, start_time, end_time, date, teacher_firstname, teacher_lastname FROM appointments
      `);

      return res.status(200).json({ message: "Appointments fetched succesfully", rows });
    } catch (error) {
      console.error("Error ocurred in '/api/fetch-appointments'", error);
      return res.status(500).json({ error: 'Error ocurred in fetching appointments' });
    }
  });

  // Book an appointment
  app.post('/api/reserve-appointment', async (req, res) => { 
    try {
      const { guestFirstname, guestLastname, guestPhone, guestEmail, information, teacherId  } = req.body;
      console.log(req.body);

      const [rows] = await db.promise().query(`
        UPDATE appointments SET guest_firstname = ?, guest_lastname = ?, guest_phone = ?, guest_email = ?, information = ? WHERE teacher_id = ?
      `, [guestFirstname, guestLastname, guestPhone, guestEmail, information, teacherId]);

      const [didSucceed] = await db.promise().query(`
        SELECT (guest_email) FROM appointments WHERE teacher_id = ?
      `, [teacherId]); 

      if (didSucceed.length > 0) {
        await db.promise().query(`INSERT INTO reserved_appointments SELECT * FROM appointments WHERE teacher_id = ?`, teacherId)
        .then(() => {
          db.promise().query(`DELETE FROM appointments WHERE teacher_id = ?`, [teacherId]);
        });
      } else {
        return res.status(404).json({ error: "Couldnt book appointment" });
      }

      return res.status(200).json({ message: "Appointment reserved" });

    }catch (error) {
      console.error("Error ocurred in reserve-appointment", error);  
      return res.status(500).json({ error: 'Server error ocurred', error });
    }
  });
  // Fetches appointments booked for the user
  app.get('/api/fetch-my-appointments', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.userId;

      const [rows] = await db.promise().query(`
      SELECT * FROM reserved_appointments WHERE teacher_id = ?
      `, [userId]);

      return res.status(200).json({ message: "Appointments fetched succesfully", rows })
    } catch (error) {
      console.error("Unable to fetch appointments", error);
      return res.status(500).json({ error: 'Unable to fetch my appointments' });
    }
  });
  // Delete appointment associated with id
  app.delete('/api/delete-appointment/:id',authenticateToken,  async (req, res) => {
    try {
      const { id } = req.params;

      const [rows] = await db.promise().query('DELETE FROM reserved_appointments WHERE id = ?', [id]);

      return res.status(200).json({ message: "Appointment deleted succefully" });
    } catch (error) {
      console.error("Error ocurred in '/api/delete-appointment'", error);
      return res.status(500).json({ error: "Could not delete appointment" });
    }
  }); 
  // Saves new values for user
  app.put('/api/save-changes/', authenticateToken, async (req, res) => {
    try {
      const { firstname, lastname, phone, id } = req.body;

      // Save older values before changing to new
      const [oldRows] = await db.promise().query(`
      SELECT * from users WHERE id = ? 
      `, [id]);
      // If old value is not changed upon save
      // value stays the same
      const [rows] = await db.promise().query(`
      UPDATE users SET firstname = ?, lastname = ?, phone = ? WHERE id = ?
    `, [
      firstname !== undefined ? firstname : oldRows[0].firstname,
      lastname !== undefined ? lastname : oldRows[0].lastname,
      phone !== undefined ? phone : oldRows[0].phone,
      id
    ]);

      return res.status(200).json({ message: "Changes saved succesfully", rows });
    } catch (error) {
      console.error("Unable to save changes", error);
      return res.status(500).json({ error: "Error ocurred in '/api/save-changes'" });
    }
  });
  // Get users message associated with appointment
  app.get('/api/fetch-appointment-extra', async (req, res) => {
    try {
      const { id } = req.body;
      
      const [rows] = await db.promise().query(`
      SELECT guest_information FROM reserved_appointments WHERE id = ?
      `, [id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Error fetching appointment information' });
      }

      return res.status(200).json({ message: "Appointment information fetched succesfully", rows });
    } catch (error) {
      console.error("Unable to fetch appointment information", error);
      return res.status(500).json({ error: "Unable to fetch appointment information" })
    }
  });
  // Password change
  app.put('/api/user-password', async (req, res) => {
    try {
      const { currentPassword, newPassword, confirmPassword, userId } = req.body;
      console.log(req.body);
  
      // Check if user exists
      const [rows] = await db.promise().query('SELECT * FROM users WHERE id = ?', [userId]);
      
      // If user not found, return error
      if (rows.length === 0) {
        return res.status(404).json({ error: "Could not find user" });
      }
      // Compare old and new password
      const [oldPasswordRow] = await db.promise().query('SELECT password FROM users WHERE id = ?', [userId]);
      const oldPassword = oldPasswordRow[0].password;
  
      const currPwdCompare = await bcrypt.compare(currentPassword, oldPassword);

      if (!currPwdCompare) {
        console.log("invalid password");
        return res.status(401).json({ error: "Invalid password!" });
      }

      if (newPassword !== confirmPassword) {
        console.log("Passwords dont match");
        return res.status(401).json({ error: "Passwords do not match!" });
      }
      // Secure/hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      await db.promise().query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId]);
  
      console.log("Succesfully changed password");
      return res.status(200).json({ message: "Success" });
    } catch (error) {
      console.error("Error ocurred in '/api/user-password'", error);
      return res.status(500).json({ error: "Unable to fetch user password" });
    }
  });
  
  app.listen(5000, () => {
      console.log(`Server running on ${port}`);
  });
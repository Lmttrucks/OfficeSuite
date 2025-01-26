# OfficeSuite
# 🚛 OfficeSuite

## 🌐 Overview

This project converts an existing **MS Access-based system** to a modern web application using:

- **Front-End:** React + Material-UI  
- **Back-End:** Node.js + Express  
- **Database:** Azure SQL  

The goal is to manage forestry transport logistics efficiently, including collecting load information, permitting loads, invoicing customers, processing submissions from the MLog mobile app and registering users etc.

---

## 📂 Project Structure

- **frontend/** - React front-end using Material-UI components  
- **backend/** - Node.js + Express server for handling API requests  
- **db-scripts/** - SQL scripts to set up and manage the Azure SQL database  

---

## 🛠️ **Tech Stack**

| Layer         | Technology      |
|---------------|-----------------|
| **Front-End** | React + Material-UI  |
| **Back-End**  | Node.js + Express    |
| **Database**  | Azure SQL            |

---

## 🚀 **Setup Instructions**

### 1. **Backend Setup**


Created server.js file

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sql = require('mssql');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Azure SQL Database Configuration
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, // e.g., 'your-server-name.database.windows.net'
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // Use encryption for Azure SQL
    },
};

// Test database connection
app.get('/api/test-db', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        res.send('Database connection successful!');
    } catch (err) {
        res.status(500).send('Database connection failed: ' + err.message);
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});




Created .env file 

DB_USER=ShaneMorrisAdmin8933672888877664
DB_PASSWORD="mypassword"
DB_SERVER=mlogserver.database.windows.net
DB_NAME=Mlog-DB
PORT=5000




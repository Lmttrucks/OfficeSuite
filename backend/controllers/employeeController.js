const sql = require('mssql');
const logger = require('../utils/logger'); // Import the logger utility
require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: { encrypt: true },
};

exports.addEmployee = async (req, res) => {
    logger.log('Received: Add employee request with data:', req.body);
    const { AppUserID, ContactID, DOB, EmPPS, StartD, EndDD, Duties, DLNo, DLExpiry, WorkStatus, FAExpiry, MHExpiry, CCExpiry, Comments, UserID, DateAdded, EmployeeName } = req.body;
    const query = `INSERT INTO [dbo].[tblEmployee] (AppUserID, ContactID, DOB, EmPPS, StartD, EndDD, Duties, DLNo, DLExpiry, WorkStatus, FAExpiry, MHExpiry, CCExpiry, Comments, UserID, DateAdded, EmployeeName) 
                   VALUES (@AppUserID, @ContactID, @DOB, @EmPPS, @StartD, @EndDD, @Duties, @DLNo, @DLExpiry, @WorkStatus, @FAExpiry, @MHExpiry, @CCExpiry, @Comments, @UserID, @DateAdded, @EmployeeName)`;

    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('AppUserID', sql.Int, AppUserID)
            .input('ContactID', sql.Int, ContactID)
            .input('DOB', sql.Date, DOB)
            .input('EmPPS', sql.NVarChar, EmPPS)
            .input('StartD', sql.Date, StartD)
            .input('EndDD', sql.Date, EndDD)
            .input('Duties', sql.NVarChar, Duties)
            .input('DLNo', sql.NVarChar, DLNo)
            .input('DLExpiry', sql.Date, DLExpiry)
            .input('WorkStatus', sql.NVarChar, WorkStatus)
            .input('FAExpiry', sql.Date, FAExpiry)
            .input('MHExpiry', sql.Date, MHExpiry)
            .input('CCExpiry', sql.Date, CCExpiry)
            .input('Comments', sql.NVarChar, Comments)
            .input('UserID', sql.Int, UserID)
            .input('DateAdded', sql.Date, DateAdded)
            .input('EmployeeName', sql.NVarChar, EmployeeName)
            .query(query);

        logger.log('Sent: Employee added successfully');
        res.status(201).json({ message: 'Employee added successfully' });
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.editEmployee = async (req, res) => {
    logger.log('Received: Edit employee request with ID:', req.params.id, 'and data:', req.body);
    const { id } = req.params;
    const { AppUserID, ContactID, DOB, EmPPS, StartD, EndDD, Duties, DLNo, DLExpiry, WorkStatus, FAExpiry, MHExpiry, CCExpiry, Comments, UserID, DateAdded, EmployeeName } = req.body;
    const query = `UPDATE [dbo].[tblEmployee] SET AppUserID = @AppUserID, ContactID = @ContactID, DOB = @DOB, EmPPS = @EmPPS, StartD = @StartD, EndDD = @EndDD, Duties = @Duties, DLNo = @DLNo, DLExpiry = @DLExpiry, WorkStatus = @WorkStatus, FAExpiry = @FAExpiry, MHExpiry = @MHExpiry, CCExpiry = @CCExpiry, Comments = @Comments, UserID = @UserID, DateAdded = @DateAdded, EmployeeName = @EmployeeName WHERE EmployeeID = @EmployeeID`;

    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('AppUserID', sql.Int, AppUserID)
            .input('ContactID', sql.Int, ContactID)
            .input('DOB', sql.Date, DOB)
            .input('EmPPS', sql.NVarChar, EmPPS)
            .input('StartD', sql.Date, StartD)
            .input('EndDD', sql.Date, EndDD)
            .input('Duties', sql.NVarChar, Duties)
            .input('DLNo', sql.NVarChar, DLNo)
            .input('DLExpiry', sql.Date, DLExpiry)
            .input('WorkStatus', sql.NVarChar, WorkStatus)
            .input('FAExpiry', sql.Date, FAExpiry)
            .input('MHExpiry', sql.Date, MHExpiry)
            .input('CCExpiry', sql.Date, CCExpiry)
            .input('Comments', sql.NVarChar, Comments)
            .input('UserID', sql.Int, UserID)
            .input('DateAdded', sql.Date, DateAdded)
            .input('EmployeeName', sql.NVarChar, EmployeeName)
            .input('EmployeeID', sql.Int, id)
            .query(query);

        logger.log('Sent: Employee updated successfully');
        res.status(200).json({ message: 'Employee updated successfully' });
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    logger.log('Received: Delete employee request with ID:', req.params.id);
    const { id } = req.params;
    const query = `UPDATE [dbo].[tblEmployee] SET Void = 1 WHERE EmployeeID = @EmployeeID`;

    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('EmployeeID', sql.Int, id)
            .query(query);

        logger.log('Sent: Employee removed successfully');
        res.status(200).json({ message: 'Employee removed successfully' });
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

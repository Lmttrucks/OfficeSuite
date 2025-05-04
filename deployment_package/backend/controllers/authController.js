const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger'); // Import the logger utility
require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
    },
};

exports.register = async (req, res) => {
    logger.log('Received: Register user request with data:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.log('Sent: Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, userRole, isActive, employeeID, companyID, contactID } = req.body;

    try {
        await sql.connect(dbConfig);

        const existingUser = await sql.query`SELECT * FROM tblAppUsers WHERE UserName = ${username}`;
        if (existingUser.recordset.length > 0) {
            logger.log('Sent: Username already exists');
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await sql.query`
            INSERT INTO tblAppUsers (UserName, Password, UserRole, IsActive, EmployeeID, CompanyID, ContactID, CreatedDate)
            VALUES (${username}, ${hashedPassword}, ${userRole}, ${isActive}, ${employeeID}, ${companyID}, ${contactID}, GETDATE())
        `;

        logger.log('Sent: User registered successfully');
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.login = async (req, res) => {
    logger.log('Received: Login request with data:', req.body);
    const { username, password } = req.body;

    try {
        await sql.connect(dbConfig);

        const result = await sql.query`SELECT * FROM tblAppUsers WHERE UserName = ${username}`;
        if (result.recordset.length === 0) {
            logger.log('Sent: Invalid username or password');
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = result.recordset[0];
        const passwordMatch = await bcrypt.compare(password, user.Password);

        if (!passwordMatch) {
            logger.log('Sent: Invalid username or password');
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        if (!process.env.JWT_SECRET) {
            logger.log('Sent: JWT secret is not configured');
            return res.status(500).json({ message: 'JWT secret is not configured' });
        }

        const token = jwt.sign(
            { userId: user.AppUserID, role: user.UserRole },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        logger.log('Sent: Login successful');
        res.json({
            message: 'Login successful',
            token,
            role: user.UserRole,
            username: user.UserName,
            userID: user.EmployeeID
        });
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.editUser = async (req, res) => {
    logger.log('Received: Edit user request with ID:', req.params.id, 'and data:', req.body);
    const { id } = req.params;
    const { username, password, userRole, isActive, employeeID, companyID, contactID } = req.body;

    try {
        await sql.connect(dbConfig);

        const existingUser = await sql.query`SELECT * FROM tblAppUsers WHERE UserID = ${id}`;
        if (existingUser.recordset.length === 0) {
            logger.log('Sent: User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        await sql.query`
            UPDATE tblAppUsers
            SET
                UserName = COALESCE(${username}, UserName),
                Password = COALESCE(${hashedPassword}, Password),
                UserRole = COALESCE(${userRole}, UserRole),
                IsActive = COALESCE(${isActive}, IsActive),
                EmployeeID = COALESCE(${employeeID}, EmployeeID),
                CompanyID = COALESCE(${companyID}, CompanyID),
                ContactID = COALESCE(${contactID}, ContactID)
            WHERE UserID = ${id}
        `;

        logger.log('Sent: User updated successfully');
        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getUsers = async (req, res) => {
    logger.log('Received: Get all users request');
    try {
        await sql.connect(dbConfig);

        const result = await sql.query`SELECT UserID, UserName FROM tblAppUsers`;

        logger.log('Sent:', result.recordset);
        res.status(200).json(result.recordset);
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getUserById = async (req, res) => {
    logger.log('Received: Get user by ID request with ID:', req.params.id);
    const { id } = req.params;

    try {
        await sql.connect(dbConfig);

        const result = await sql.query`SELECT UserID, UserName, UserRole, IsActive, EmployeeID, CompanyID, ContactID FROM tblAppUsers WHERE UserID = ${id}`;

        if (result.recordset.length === 0) {
            logger.log('Sent: User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        logger.log('Sent:', result.recordset[0]);
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    logger.log('Received: Delete user request with ID:', req.params.id);
    const { id } = req.params;

    try {
        await sql.connect(dbConfig);

        const result = await sql.query`UPDATE tblAppUsers SET Void = 1 WHERE UserID = ${id}`;

        if (result.rowsAffected[0] === 0) {
            logger.log('Sent: User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        logger.log('Sent: User deleted successfully');
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


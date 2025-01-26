const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const { validationResult } = require('express-validator');
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, userRole, isActive, employeeID, companyID, contactID } = req.body;

    try {
        await sql.connect(dbConfig);

        const existingUser = await sql.query`SELECT * FROM tblAppUsers WHERE UserName = ${username}`;
        if (existingUser.recordset.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await sql.query`
            INSERT INTO tblAppUsers (UserName, Password, UserRole, IsActive, EmployeeID, CompanyID, ContactID, CreatedDate)
            VALUES (${username}, ${hashedPassword}, ${userRole}, ${isActive}, ${employeeID}, ${companyID}, ${contactID}, GETDATE())
        `;

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        await sql.connect(dbConfig);

        const result = await sql.query`SELECT * FROM tblAppUsers WHERE UserName = ${username}`;
        if (result.recordset.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = result.recordset[0];
        const passwordMatch = await bcrypt.compare(password, user.Password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT secret is not configured' });
        }

        const token = jwt.sign(
            { userId: user.AppUserID, role: user.UserRole },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login successful',
            token,
            role: user.UserRole,
            username: user.UserName,
            userID: user.EmployeeID
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.editUser = async (req, res) => {
    const { id } = req.params;
    const { username, password, userRole, isActive, employeeID, companyID, contactID } = req.body;

    try {
        await sql.connect(dbConfig);

        const existingUser = await sql.query`SELECT * FROM tblAppUsers WHERE UserID = ${id}`;
        if (existingUser.recordset.length === 0) {
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

        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        await sql.connect(dbConfig);

        const result = await sql.query`SELECT UserID, UserName FROM tblAppUsers`;

        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        await sql.connect(dbConfig);

        const result = await sql.query`SELECT UserID, UserName, UserRole, IsActive, EmployeeID, CompanyID, ContactID FROM tblAppUsers WHERE UserID = ${id}`;

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(result.recordset[0]);
    } catch (err) {
        res.status (500).json({ message: 'Server error', error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await sql.connect(dbConfig);

        const result = await sql.query`DELETE FROM tblAppUsers WHERE UserID = ${id}`;

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


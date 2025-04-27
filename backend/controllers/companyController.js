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

exports.getAllCompanies = async (req, res) => {
    logger.log('Received: Get all companies request');
    try {
        await sql.connect(dbConfig);
        const result = await sql.query`SELECT * FROM tblCompanies WHERE Void = 0`;
        logger.log('Sent:', result.recordset);
        res.json(result.recordset);
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.getCompanyById = async (req, res) => {
    const { id } = req.params;
    logger.log('Received: Get company by ID request with ID:', id);
    try {
        await sql.connect(dbConfig);
        const result = await sql.query`SELECT * FROM tblCompanies WHERE CompanyID = ${id} AND Void = 0`;
        if (result.recordset.length === 0) {
            logger.log('Sent: Company not found');
            return res.status(404).json({ message: 'Company not found' });
        }
        logger.log('Sent:', result.recordset[0]);
        res.json(result.recordset[0]);
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.createCompany = async (req, res) => {
    const { CompanyName, CompanyAddress, CompanyPhone, CompanyEmail } = req.body;
    logger.log('Received: Create company request with data:', req.body);
    try {
        await sql.connect(dbConfig);
        await sql.query`
            INSERT INTO tblCompanies (CompanyName, CompanyAddress, CompanyPhone, CompanyEmail, DateAdded)
            VALUES (${CompanyName}, ${CompanyAddress}, ${CompanyPhone}, ${CompanyEmail}, GETDATE())
        `;
        logger.log('Sent: Company created successfully');
        res.status(201).json({ message: 'Company created successfully' });
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.updateCompany = async (req, res) => {
    const { id } = req.params;
    const { CompanyName, CompanyAddress, CompanyPhone, CompanyEmail } = req.body;
    logger.log('Received: Update company request with ID:', id, 'and data:', req.body);

    try {
        await sql.connect(dbConfig);
        const result = await sql.query`SELECT * FROM tblCompanies WHERE CompanyID = ${id}`;
        if (result.recordset.length === 0) {
            logger.log('Sent: Company not found');
            return res.status(404).json({ message: 'Company not found' });
        }

        await sql.query`
            UPDATE tblCompanies
            SET CompanyName = ${CompanyName},
                CompanyAddress = ${CompanyAddress},
                CompanyPhone = ${CompanyPhone},
                CompanyEmail = ${CompanyEmail}
            WHERE CompanyID = ${id}
        `;
        logger.log('Sent: Company updated successfully');
        res.json({ message: 'Company updated successfully' });
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.deleteCompany = async (req, res) => {
    const { id } = req.params;
    logger.log('Received: Delete company request with ID:', id);

    try {
        await sql.connect(dbConfig);
        const result = await sql.query`SELECT * FROM tblCompanies WHERE CompanyID = ${id}`;
        if (result.recordset.length === 0) {
            logger.log('Sent: Company not found');
            return res.status(404).json({ message: 'Company not found' });
        }

        await sql.query`UPDATE tblCompanies SET Void = 1 WHERE CompanyID = ${id}`;
        logger.log('Sent: Company marked as void successfully');
        res.json({ message: 'Company marked as void successfully' });
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: err.message });
    }
};
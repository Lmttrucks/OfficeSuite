const sql = require('mssql');
const logger = require('../utils/logger'); // Import the logger utility
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Parser } = require('json2csv');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
    },
};

exports.getCompanies = async (req, res) => {
    logger.log('Received: Get companies request');
    try {
        await sql.connect(dbConfig);
        const result = await sql.query`SELECT CompanyID, CompanyName FROM tblCompanies WHERE Void = 0 ORDER BY CompanyID`;
        logger.log('Sent:', result.recordset);
        res.json(result.recordset);
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getEmployees = async (req, res) => {
    logger.log('Received: Get employees request');
    try {
        await sql.connect(dbConfig);
        const result = await sql.query`SELECT EmployeeID, EmployeeName FROM tblEmployee WHERE Void = 0 ORDER BY EmployeeID`;
        logger.log('Sent:', result.recordset);
        res.json(result.recordset);
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getVehicles = async (req, res) => {
    logger.log('Received: Get vehicles request');
    try {
        await sql.connect(dbConfig);
        const result = await sql.query`SELECT VehicleID, VehicleReg FROM tblVehicle WHERE Void = 0 ORDER BY VehicleReg`;
        logger.log('Sent:', result.recordset);
        res.json(result.recordset);
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getLocations = async (req, res) => {
    logger.log('Received: Get locations request');
    try {
        await sql.connect(dbConfig);
        const result = await sql.query`SELECT ID, Location FROM tblLocations WHERE Void = 0 ORDER BY Location`;
        logger.log('Sent:', result.recordset);
        res.json(result.recordset);
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getJobs = async (req, res) => {
    logger.log('Received: Get jobs request');
    try {
        await sql.connect(dbConfig);
        const result = await sql.query`SELECT JobID, DefaultCompany, DefaultOrigin, DefaultDestination, DefaultRate FROM tblJobs WHERE Void = 0 ORDER BY JobID`;
        logger.log('Sent:', result.recordset);
        res.json(result.recordset);
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getCompanyInfo = async (req, res) => {
    logger.log('Received: Get company info request with companyName:', req.params.companyName);
    const { companyName } = req.params;

    try {
        await sql.connect(dbConfig);
        const result = await sql.query`
            SELECT CompanyID, CompanyName, CompanyAddress, CompanyEmail
            FROM tblCompanies 
            WHERE CompanyName = ${companyName}`;

        if (result.recordset.length === 0) {
            logger.log('Sent: Company not found');
            return res.status(404).json({ message: 'Company not found' });
        }

        logger.log('Sent:', result.recordset[0]);
        res.json(result.recordset[0]);
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getDistinctOrigins = async (req, res) => {
    logger.log('Received: Get distinct origins request');
    try {
        await sql.connect(dbConfig);
        const result = await sql.query`
            SELECT DISTINCT Origin 
            FROM (
                SELECT TOP 3000 Origin 
                FROM tblLoads 
                WHERE Archived = 0
                ORDER BY ID DESC
            ) AS RecentLoads
            ORDER BY Origin`;
        logger.log('Sent:', result.recordset);
        res.json(result.recordset);
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getDistinctDestinations = async (req, res) => {
    logger.log('Received: Get distinct destinations request');
    try {
        await sql.connect(dbConfig);
        const result = await sql.query`
            SELECT DISTINCT Destination 
            FROM (
                SELECT TOP 3000 Destination 
                FROM tblLoads 
                WHERE Archived = 0
                AND Void = 0
                ORDER BY ID DESC
            ) AS RecentLoads
            ORDER BY Destination`;
        logger.log('Sent:', result.recordset);
        res.json(result.recordset);
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

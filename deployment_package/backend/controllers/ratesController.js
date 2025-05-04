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

const addRate = async (req, res) => {
    logger.log('Received: Add rate request with data:', req.body);
    const { KMRangeFrom, KMRangeTo, RateEuro, IsActive } = req.body;

    if (KMRangeFrom == null || KMRangeTo == null || RateEuro == null) {
        return res.status(400).json({ message: 'KMRangeFrom, KMRangeTo, and RateEuro are required' });
    }

    try {
        await sql.connect(dbConfig);
        await sql.query`
            INSERT INTO tblRates (KMRangeFrom, KMRangeTo, RateEuro, IsActive)
            VALUES (${KMRangeFrom}, ${KMRangeTo}, ${RateEuro}, ${IsActive ?? 1})`;

        logger.log('Sent: Rate added successfully');
        res.status(201).json({ message: 'Rate added successfully' });
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: 'Failed to add rate', error: err.message });
    }
};

const adjustRates = async (req, res) => {
    logger.log('Received: Adjust rates request with data:', req.body);
    const { PercentageIncrease } = req.body;

    if (PercentageIncrease == null) {
        return res.status(400).json({ message: 'PercentageIncrease is required' });
    }

    try {
        await sql.connect(dbConfig);
        await sql.query`
            EXEC AdjustRates @PercentageIncrease = ${PercentageIncrease}`;

        logger.log('Sent: Rates adjusted successfully');
        res.status(200).json({ message: 'Rates adjusted successfully' });
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: 'Failed to adjust rates', error: err.message });
    }
};

const getAllRates = async (req, res) => {
    logger.log('Received: Get all rates request');
    try {
        await sql.connect(dbConfig);
        const result = await sql.query`SELECT * FROM tblRates`;
        logger.log('Sent:', result.recordset);
        res.json(result.recordset);
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: 'Failed to fetch rates', error: err.message });
    }
};

const editRate = async (req, res) => {
    logger.log('Received: Edit rate request with data:', req.body);
    const { RateID, KMRangeFrom, KMRangeTo, RateEuro, IsActive } = req.body;

    if (!RateID || KMRangeFrom == null || KMRangeTo == null || RateEuro == null) {
        return res.status(400).json({ message: 'RateID, KMRangeFrom, KMRangeTo, and RateEuro are required' });
    }

    try {
        await sql.connect(dbConfig);
        await sql.query`
            UPDATE tblRates
            SET KMRangeFrom = ${KMRangeFrom},
                KMRangeTo = ${KMRangeTo},
                RateEuro = ${RateEuro},
                IsActive = ${IsActive ?? 1},
                ModifiedDate = GETDATE()
            WHERE RateID = ${RateID}`;

        logger.log('Sent: Rate updated successfully');
        res.status(200).json({ message: 'Rate updated successfully' });
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: 'Failed to update rate', error: err.message });
    }
};

module.exports = {
    addRate,
    adjustRates,
    getAllRates,
    editRate, // Export the new function
};
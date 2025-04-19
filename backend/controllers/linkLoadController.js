const sql = require('mssql');
const logger = require('../utils/logger'); // Import the logger utility
require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true
    },
};

sql.connect(dbConfig).catch(err => logger.log('SQL connection error:', err));

exports.addLinkLoad = async (req, res) => {
    logger.log('Received: Add link load request with data:', req.body);
    const { loadID, companyName, linkNo, rate, purchase } = req.body;

    try {
        const companyResult = await sql.query`SELECT CompanyID FROM tblCompanies WHERE CompanyName = ${companyName}`;
        if (companyResult.recordset.length === 0) {
            logger.log('Sent: Company not found');
            return res.status(404).json({ message: 'Company not found.' });
        }

        const companyID = companyResult.recordset[0].CompanyID;

        await sql.query`
            INSERT INTO tblLinkLoads (LoadID, CompanyID, LinkNo, Rate, Purchase)
            VALUES (${loadID}, ${companyID}, ${linkNo || null}, ${rate}, ${purchase})`;

        logger.log('Sent: Link load added successfully');
        res.status(201).json({ message: 'Link load added successfully' });
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: 'Failed to add link load', error: err.message });
    }
};

exports.updateLinkLoad = async (req, res) => {
    logger.log('Received: Update link load request with ID:', req.params.ID, 'and data:', req.body);
    const { ID } = req.params;
    const { linkNo, rate, invoiceNo, paid, deleted, purchase } = req.body;

    try {
        const updateFields = [];
        const updateValues = {};

        if (linkNo !== undefined) {
            updateFields.push('LinkNo = @LinkNo');
            updateValues.LinkNo = linkNo;
        }
        if (rate !== undefined) {
            updateFields.push('Rate = @Rate');
            updateValues.Rate = rate;
        }
        if (invoiceNo !== undefined) {
            updateFields.push('InvoiceNo = @InvoiceNo');
            updateValues.InvoiceNo = invoiceNo;
        }
        if (paid !== undefined) {
            updateFields.push('Paid = @Paid');
            updateValues.Paid = paid;
        }
        if (deleted !== undefined) {
            updateFields.push('Deleted = @Deleted');
            updateValues.Deleted = deleted;
        }
        if (purchase !== undefined) {
            updateFields.push('Purchase = @Purchase');
            updateValues.Purchase = purchase;
        }

        if (updateFields.length === 0) {
            logger.log('Sent: No fields to update');
            return res.status(400).json({ message: 'No fields to update.' });
        }

        const updateQuery = `
            UPDATE tblLinkLoads
            SET ${updateFields.join(', ')}
            WHERE ID = @ID`;

        const request = new sql.Request();
        Object.keys(updateValues).forEach(key => {
            request.input(key, updateValues[key]);
        });
        request.input('ID', ID);

        const result = await request.query(updateQuery);

        if (result.rowsAffected[0] === 0) {
            logger.log('Sent: Link load not found');
            return res.status(404).json({ message: "Link load not found." });
        }

        logger.log('Sent: Link load updated successfully');
        res.json({ message: "Link load updated successfully." });
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: 'Failed to update link load', error: err.message });
    }
};

exports.updateLinkLoadInvoiceNo = async (req, res) => {
    const { id, invoiceNo } = req.body;

    try {
        const result = await sql.query`
            UPDATE tblLinkLoads
            SET InvoiceNo = ${invoiceNo}
            WHERE ID = ${id}`;

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Load not found." });
        }

        res.json({ message: "Link Invoice No updated successfully." });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update Link Invoice No', error: err.message });
    }
};

exports.getExternalLoads = async (req, res) => {
    logger.log('Received: Get external loads request');
    try {
        const result = await sql.query`
            SELECT 
                l.ID,
                l.JobID,
                l.PermitNo,
                l.WeightDocNo,
                l.DeliveryDate,
                l.UnitQuantity,
                l.Origin,
                l.Destination,
                l.Archived,
                l.Purchase
            FROM tblLoads l
            JOIN tblEmployee e ON l.EmployeeID = e.EmployeeID
            WHERE e.EmployeeName = 'External'
            AND l.Archived = 0 AND l.Void = 0`;

        if (result.recordset.length === 0) {
            logger.log('Sent: No loads found for the specified criteria');
            return res.status(404).json({ message: "No loads found for the specified criteria." });
        }

        logger.log('Sent:', result.recordset);
        res.json(result.recordset);
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: 'Failed to fetch records', error: err.message });
    }
};

exports.previewLinkedLoadsInvoice = async (req, res) => {
    const { CompanyName, StartDate, EndDate, Purchase } = req.body;

    try {
        await sql.connect(dbConfig);

        const loadsResult = await sql.query`
        SELECT 
            ll.ID,
            ll.LoadID,
            ll.Rate,
            l.PermitNo,
            l.WeightDocNo,
            l.Origin,
            l.Destination,
            l.UnitQuantity,
            l.DeliveryDate
        FROM tblLinkLoads ll
        INNER JOIN tblCompanies c ON ll.CompanyID = c.CompanyID
        INNER JOIN tblLoads l ON ll.LoadID = l.ID
        WHERE c.CompanyName = ${CompanyName}
          AND l.DeliveryDate BETWEEN ${StartDate} AND ${EndDate}
          AND l.Void = 0
          AND ll.Paid = 0
          AND ll.Void = 0
          AND ll.Purchase = ${Purchase}`;

        if (loadsResult.recordset.length === 0) {
            return res.status(404).json({ message: 'No linked loads found for the specified company and date range' });
        }

        res.json(loadsResult.recordset);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getLinkedLoadsByLoadID = async (req, res) => {
    const { loadID } = req.params;

    try {
        const result = await sql.query`
            SELECT 
                ll.ID,
                ll.LoadID,
                ll.CompanyID,
                c.CompanyName,
                ll.LinkNo,
                ll.Rate,
                ll.Purchase
            FROM tblLinkLoads ll
            INNER JOIN tblCompanies c ON ll.CompanyID = c.CompanyID
            WHERE ll.LoadID = ${loadID}`;

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No linked loads found for the specified LoadID' });
        }

        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch linked loads', error: err.message });
    }
};

exports.getLast1000LinkedLoads = async (req, res) => {
    try {
        const result = await sql.query`
            SELECT 
                ll.ID,
                ll.LoadID,
                ll.Rate,
                c.CompanyName,
                l.PermitNo,
                l.WeightDocNo,
                l.Origin,
                l.Destination,
                l.UnitQuantity,
                l.DeliveryDate,
                ll.Purchase,
                ll.InvoiceNo
            FROM tblLinkLoads ll
            INNER JOIN tblCompanies c ON ll.CompanyID = c.CompanyID
            INNER JOIN tblLoads l ON ll.LoadID = l.ID
            WHERE l.Void = 0
              AND ll.Paid = 0
              AND ll.Void = 0
            ORDER BY ll.ID DESC
            OFFSET 0 ROWS FETCH NEXT 1000 ROWS ONLY`;

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No linked loads found' });
        }

        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch linked loads', error: err.message });
    }
};

exports.deleteLinkLoad = async (req, res) => {
    logger.log('Received: Delete link load request with ID:', req.params.id);
    const { id } = req.params;

    try {
        const result = await sql.query`
            UPDATE tblLinkLoads
            SET Void = 1
            WHERE ID = ${id}`;

        if (result.rowsAffected[0] === 0) {
            logger.log('Sent: Link load not found');
            return res.status(404).json({ message: "Link load not found." });
        }

        logger.log('Sent: Link load marked as void successfully');
        res.json({ message: "Link load marked as void successfully." });
    } catch (err) {
        logger.log('Error:', err.message);
        res.status(500).json({ message: 'Failed to mark link load as void', error: err.message });
    }
};

const sql = require('mssql');
const { BlobServiceClient } = require('@azure/storage-blob');
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

exports.previewSalesInvoice = async (req, res) => {
    const { CompanyName, StartDate, EndDate, JobID } = req.body;

    try {
        await sql.connect(dbConfig);

        const query = `
        SELECT 
            l.ID,
            l.JobID,
            l.PermitNo,
            l.WeightDocNo,
            l.Origin,
            l.Destination,
            l.Rate,
            l.UnitQuantity
        FROM tblLoads l
        INNER JOIN tblCompanies c ON l.CompanyID = c.CompanyID
        WHERE c.CompanyName = @CompanyName
          AND l.DeliveryDate BETWEEN @StartDate AND @EndDate
          AND l.InvoiceNo IS NULL
          AND l.Archived = 0
          ${JobID ? 'AND l.JobID = @JobID' : ''}
        `;

        const request = new sql.Request();
        request.input('CompanyName', sql.VarChar, CompanyName);
        request.input('StartDate', sql.Date, StartDate);
        request.input('EndDate', sql.Date, EndDate);
        if (JobID) {
            request.input('JobID', sql.VarChar, JobID);
        }

        const loadsResult = await request.query(query);

        if (loadsResult.recordset.length === 0) {
            return res.status(404).json({ message: 'No loads found for the specified criteria' });
        }

        res.json(loadsResult.recordset);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.insertInvoice = async (req, res) => {
    const { CompanyID, StartDate, EndDate, VatRate, LoadCount, PaymentAmount, InvoiceURL, UserID, Purchase } = req.body;

    try {
        await sql.connect(dbConfig);

        const result = await sql.query`
            INSERT INTO tblInvoice (
                CompanyID,
                StartDate,
                EndDate,
                VatRate,
                LoadCount,
                Generated,
                PaymentAmount,
                InvoiceURL,
                UserID,
                DateAdded,
                Purchase
            ) OUTPUT INSERTED.InvoiceNo
            VALUES (
                ${CompanyID},
                ${StartDate},
                ${EndDate},
                ${VatRate},
                ${LoadCount},
                GETDATE(),
                ${PaymentAmount},
                ${InvoiceURL},
                ${UserID},
                GETDATE(),
                ${Purchase}
            )`;

        const invoiceNo = result.recordset[0].InvoiceNo;

        res.status(201).json({ invoiceNo });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.uploadInvoiceToBlob = async (req, res) => {
    const { file } = req;
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME);

    try {
        const blockBlobClient = containerClient.getBlockBlobClient(file.originalname);
        await blockBlobClient.uploadData(file.buffer);

        res.status(201).json({ message: 'Invoice uploaded successfully', url: blockBlobClient.url });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getInvoicesByCompanyName = async (req, res) => {
    const { CompanyName } = req.query;

    try {
        await sql.connect(dbConfig);

        const result = await sql.query`
        SELECT *
        FROM tblInvoice i
        INNER JOIN tblCompanies c ON i.CompanyID = c.CompanyID
        WHERE c.CompanyName = ${CompanyName}`;

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No invoices found for the specified company' });
        }

        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getLoadsByInvoiceNo = async (req, res) => {
    const { invoiceNo } = req.query;

    try {
        await sql.connect(dbConfig);

        const result = await sql.query`
        SELECT 
            l.ID,
            l.JobID,
            l.PermitNo,
            l.WeightDocNo,
            l.Origin,
            l.Destination,
            l.Rate,
            l.UnitQuantity
        FROM tblLoads l
        WHERE l.InvoiceNo = ${invoiceNo}
        AND l.Archived = 0`;

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No loads found for the specified invoice number' });
        }

        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.deleteInvoiceByInvoiceNo = async (req, res) => {
    const { invoiceNo } = req.query;

    try {
        await sql.connect(dbConfig);

        const result = await sql.query`
        DELETE FROM tblInvoice
        WHERE InvoiceNo = ${invoiceNo}`;

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'No invoice found for the specified invoice number' });
        }

        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.previewLinkedLoadsInvoice = async (req, res) => {
    const { CompanyName, StartDate, EndDate } = req.body;

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
          AND ll.Paid = 0
          AND ll.Void = 0`;

        if (loadsResult.recordset.length === 0) {
            return res.status(404).json({ message: 'No linked loads found for the specified company and date range' });
        }

        res.json(loadsResult.recordset);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

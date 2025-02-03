const fs = require('fs');
const path = require('path');
const sql = require('mssql');
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

sql.connect(dbConfig).catch(err => console.error('SQL connection error:', err));

exports.searchLoadsByCompanyAndDate = async (req, res) => {
    const { companyName, startDate, endDate } = req.query;

    if (!companyName || !startDate || !endDate) {
        return res.status(400).json({ message: "Please provide companyName, startDate, and endDate." });
    }

    try {
        const result = await new sql.Request()
            .input('CompanyName', sql.NVarChar, companyName)
            .input('StartDate', sql.Date, startDate)
            .input('EndDate', sql.Date, endDate)
            .query(`
                SELECT 
                    l.ID,
                    c.CompanyName,
                    c.CompanyAddress,
                    l.DeliveryDate,
                    l.JobID,
                    l.PermitNo,
                    l.WeightDocNo,
                    l.Rate,
                    l.UnitQuantity,
                    l.Origin,
                    l.Destination
                FROM 
                    tblLoads l
                JOIN 
                    tblCompanies c ON l.CompanyID = c.CompanyID
                WHERE 
                    c.CompanyName = @CompanyName AND
                    l.DeliveryDate BETWEEN @StartDate AND @EndDate AND
                    l.Archived = 0
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No loads found for the specified criteria." });
        }

        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getLoads = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 50;
        const result = await sql.query`
            SELECT TOP (${limit}) * FROM tblLoads ORDER BY ID DESC`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch records', error: err.message });
    }
};

exports.addLoad = async (req, res) => {
    const {
        employeeName, vehicleReg, companyName, jobID, permitNo, weightDocNo, deliveryDate, rate, gross, tare, origin, destination, userID } = req.body;

    try {
        const employeeResult = await sql.query`SELECT EmployeeID FROM tblEmployee WHERE EmployeeName = ${employeeName}`;
        const vehicleResult = await sql.query`SELECT VehicleID FROM tblVehicle WHERE VehicleReg = ${vehicleReg}`;
        const companyResult = await sql.query`SELECT CompanyID FROM tblCompanies WHERE CompanyName = ${companyName}`;

        if (employeeResult.recordset.length === 0 || vehicleResult.recordset.length === 0 || companyResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Employee, Vehicle, or Company not found.' });
        }

        const employeeID = employeeResult.recordset[0].EmployeeID;
        const vehicleID = vehicleResult.recordset[0].VehicleID;
        const companyID = companyResult.recordset[0].CompanyID;

        await sql.query`
            INSERT INTO tblLoads (
                EmployeeID,
                VehicleID,
                CompanyID,
                JobID,
                PermitNo,
                WeightDocNo,
                DeliveryDate,
                Rate,
                Gross,
                Tare,
                Origin,
                Destination,
                UserID
            )
            VALUES (
                ${employeeID},
                ${vehicleID},
                ${companyID},
                ${jobID},
                ${permitNo},
                ${weightDocNo},
                ${deliveryDate},
                ${rate},
                ${gross},
                ${tare},
                ${origin},
                ${destination},
                ${userID}
            )`;
        res.status(201).json({ message: 'Load added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add load', error: err.message });
    }
};

exports.getLast100Loads = async (req, res) => {
    try {
        const result = await sql.query`
           SELECT TOP 100 
    l.ID,
    l.SubmissionID,
    l.OutgoingInvoiceNo,
    l.JobID,
    c.CompanyName AS CompanyName,
    e.EmployeeName AS EmployeeName,
    v.VehicleReg AS VehicleReg,
    l.PermitNo,
    l.WeightDocNo,
    l.DeliveryDate,
    l.Rate,
    l.UnitType,
    l.UnitQuantity,
    l.Origin,
    l.Destination,
    l.Gross,
    l.Tare,
    l.Paid,
    l.Checked,
    l.PermitURL,
    l.WeightDocURL,
    l.PaperDocFiled,
    l.MobileUL,
    l.UserID,
    l.DateAdded,
    l.Archived
FROM tblLoads l
LEFT JOIN tblCompanies c ON l.CompanyID = c.CompanyID
LEFT JOIN tblEmployee e ON l.EmployeeID = e.EmployeeID
LEFT JOIN tblVehicle v ON l.VehicleID = v.VehicleID
WHERE l.Archived = 0
ORDER BY l.ID DESC;`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch records', error: err.message });
    }
};

exports.updateLoadById = async (req, res) => {
    const { id } = req.params;
    const { employeeName, vehicleReg, companyName, jobID, permitNo, weightDocNo, deliveryDate, rate, gross, tare, origin, destination, archived, outgoingInvoiceNo, unitType, unitQuantity, paid, checked, permitURL, weightDocURL, paperDocFiled, mobileUL } = req.body;

    console.log('Request body:', req.body); // Log the request body

    try {
        let employeeID, vehicleID, companyID;

        if (employeeName) {
            const employeeResult = await sql.query`SELECT EmployeeID FROM tblEmployee WHERE EmployeeName = ${employeeName}`;
            if (employeeResult.recordset.length === 0) {
                return res.status(404).json({ message: 'Employee not found.' });
            }
            employeeID = employeeResult.recordset[0].EmployeeID;
        }

        if (vehicleReg) {
            const vehicleResult = await sql.query`SELECT VehicleID FROM tblVehicle WHERE VehicleReg = ${vehicleReg}`;
            if (vehicleResult.recordset.length === 0) {
                return res.status(404).json({ message: 'Vehicle not found.' });
            }
            vehicleID = vehicleResult.recordset[0].VehicleID;
        }

        if (companyName) {
            const companyResult = await sql.query`SELECT CompanyID FROM tblCompanies WHERE CompanyName = ${companyName}`;
            if (companyResult.recordset.length === 0) {
                return res.status(404).json({ message: 'Company not found.' });
            }
            companyID = companyResult.recordset[0].CompanyID;
        }

        const updateFields = [];
        const updateValues = {};

        if (employeeID) {
            updateFields.push('EmployeeID = @employeeID');
            updateValues.employeeID = employeeID;
        }
        if (vehicleID) {
            updateFields.push('VehicleID = @vehicleID');
            updateValues.vehicleID = vehicleID;
        }
        if (companyID) {
            updateFields.push('CompanyID = @companyID');
            updateValues.companyID = companyID;
        }
        if (jobID) {
            updateFields.push('JobID = @jobID');
            updateValues.jobID = jobID;
        }
        if (permitNo) {
            updateFields.push('PermitNo = @permitNo');
            updateValues.permitNo = permitNo;
        }
        if (weightDocNo) {
            updateFields.push('WeightDocNo = @weightDocNo');
            updateValues.weightDocNo = weightDocNo;
        }
        if (deliveryDate) {
            updateFields.push('DeliveryDate = @deliveryDate');
            updateValues.deliveryDate = deliveryDate;
        }
        if (rate) {
            updateFields.push('Rate = @rate');
            updateValues.rate = rate;
        }
        if (gross) {
            updateFields.push('Gross = @gross');
            updateValues.gross = gross;
        }
        if (tare) {
            updateFields.push('Tare = @tare');
            updateValues.tare = tare;
        }
        if (origin) {
            updateFields.push('Origin = @origin');
            updateValues.origin = origin;
        }
        if (destination) {
            updateFields.push('Destination = @destination');
            updateValues.destination = destination;
        }
        if (archived !== undefined) {
            updateFields.push('Archived = @archived');
            updateValues.archived = archived;
        }
        if (outgoingInvoiceNo) {
            updateFields.push('OutgoingInvoiceNo = @outgoingInvoiceNo');
            updateValues.outgoingInvoiceNo = outgoingInvoiceNo;
        }
        if (unitType) {
            updateFields.push('UnitType = @unitType');
            updateValues.unitType = unitType;
        }
        if (unitQuantity) {
            updateFields.push('UnitQuantity = @unitQuantity');
            updateValues.unitQuantity = unitQuantity;
        }
        if (paid !== undefined) {
            updateFields.push('Paid = @paid');
            updateValues.paid = paid;
        }
        if (checked !== undefined) {
            updateFields.push('Checked = @checked');
            updateValues.checked = checked;
        }
        if (permitURL) {
            updateFields.push('PermitURL = @permitURL');
            updateValues.permitURL = permitURL;
        }
        if (weightDocURL) {
            updateFields.push('WeightDocURL = @weightDocURL');
            updateValues.weightDocURL = weightDocURL;
        }
        if (paperDocFiled !== undefined) {
            updateFields.push('PaperDocFiled = @paperDocFiled');
            updateValues.paperDocFiled = paperDocFiled;
        }
        if (mobileUL) {
            updateFields.push('MobileUL = @mobileUL');
            updateValues.mobileUL = mobileUL;
        }

        console.log('Update fields:', updateFields); // Log the update fields

        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No fields to update.' });
        }

        const updateQuery = `
            UPDATE tblLoads
            SET ${updateFields.join(', ')}
            WHERE ID = @id`;

        console.log('Update Query:', updateQuery); // Log the update query

        const request = new sql.Request();
        Object.keys(updateValues).forEach(key => {
            request.input(key, updateValues[key]);
        });
        request.input('id', id);

        const result = await request.query(updateQuery);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Load not found." });
        }

        res.json({ message: "Load updated successfully." });
    } catch (err) {
        console.error('Error updating load:', err); // Log the error
        res.status(500).json({ message: 'Failed to update load', error: err.message });
    }
};

exports.updateOutgoingInvoiceNo = async (req, res) => {
    const { id, invoiceNo } = req.body;

    try {
        const result = await sql.query`
            UPDATE tblLoads
            SET OutgoingInvoiceNo = ${invoiceNo}
            WHERE ID = ${id}`;

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Load not found." });
        }

        res.json({ message: "Outgoing Invoice No updated successfully." });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update Outgoing Invoice No', error: err.message });
    }
};

exports.deleteLoadById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await sql.query`
            DELETE FROM tblLoads WHERE ID = ${id}`;

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Load not found." });
        }

        res.json({ message: "Load deleted successfully." });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete load', error: err.message });
    }
};

exports.getAllNonArchivedLoads = async (req, res) => {
    try {
        const result = await sql.query`
            SELECT 
                l.ID,
                l.SubmissionID,
                l.OutgoingInvoiceNo,
                l.JobID,
                c.CompanyName AS CompanyName,
                e.EmployeeName AS EmployeeName,
                v.VehicleReg AS VehicleReg,
                l.PermitNo,
                l.WeightDocNo,
                l.DeliveryDate,
                l.Rate,
                l.UnitType,
                l.UnitQuantity,
                l.Origin,
                l.Destination,
                l.Gross,
                l.Tare,
                l.Paid,
                l.Checked,
                l.PermitURL,
                l.WeightDocURL,
                l.PaperDocFiled,
                l.MobileUL,
                l.UserID,
                l.DateAdded,
                l.Archived
            FROM tblLoads l
            LEFT JOIN tblCompanies c ON l.CompanyID = c.CompanyID
            LEFT JOIN tblEmployee e ON l.EmployeeID = e.EmployeeID
            LEFT JOIN tblVehicle v ON l.VehicleID = v.VehicleID
            WHERE l.Archived = 0
            ORDER BY l.ID DESC;`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch records', error: err.message });
    }
};

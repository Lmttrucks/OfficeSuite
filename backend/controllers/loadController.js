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
    const { companyName, startDate, endDate, Purchase } = req.query;

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
                    l.Archived = 0 AND
                    l.Void = 0
                    l.Purchase = ${Purchase}
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
            SELECT TOP (${limit}) * FROM tblLoads WHERE Void = 0 ORDER BY ID DESC`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch records', error: err.message });
    }
};

exports.addLoad = async (req, res) => {
  const {
    employeeName,
    vehicleReg,
    companyName,
    jobID,
    permitNo,
    weightDocNo,
    deliveryDate,
    rate,
    gross,
    tare,
    origin,
    destination,
    purchase,
    userID
  } = req.body;

  console.log('Incoming request data:', req.body);

  try {
    const employeeResult = await sql.query`SELECT EmployeeID FROM tblEmployee WHERE EmployeeName = ${employeeName}`;
    console.log('Employee query result:', employeeResult);

    const vehicleResult = await sql.query`SELECT VehicleID FROM tblVehicle WHERE VehicleReg = ${vehicleReg}`;
    console.log('Vehicle query result:', vehicleResult);

    const companyResult = await sql.query`SELECT CompanyID FROM tblCompanies WHERE CompanyName = ${companyName}`;
    console.log('Company query result:', companyResult);

    if (employeeResult.recordset.length === 0 || vehicleResult.recordset.length === 0 || companyResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Employee, Vehicle, or Company not found.' });
    }

    const employeeID = employeeResult.recordset[0].EmployeeID;
    const vehicleID = vehicleResult.recordset[0].VehicleID;
    const companyID = companyResult.recordset[0].CompanyID;

    const result = await sql.query`
      DECLARE @InsertedRows TABLE (ID INT);

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
        Purchase,
        UserID
      )
      OUTPUT INSERTED.ID INTO @InsertedRows
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
        ${purchase},
        ${userID}
      );

      SELECT ID FROM @InsertedRows;`;

    console.log('Insert query result:', result);

    const loadID = result.recordset[0].ID;
    res.status(201).json({ message: 'Load added successfully', loadID });
  } catch (err) {
    console.error('Error adding load:', err);
    res.status(500).json({ message: 'Failed to add load', error: err.message });
  }
};

exports.getLast1000Loads = async (req, res) => {
    try {
        const result = await sql.query`
           SELECT TOP 1000 
    l.ID,
    l.SubmissionID,
    l.InvoiceNo,
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
    l.Archived,
    l.Void,
    l.Purchase
FROM tblLoads l
LEFT JOIN tblCompanies c ON l.CompanyID = c.CompanyID
LEFT JOIN tblEmployee e ON l.EmployeeID = e.EmployeeID
LEFT JOIN tblVehicle v ON l.VehicleID = v.VehicleID
WHERE l.Archived = 0 AND l.Void = 0
ORDER BY l.ID DESC;`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch records', error: err.message });
    }
};

exports.updateLoadById = async (req, res) => {
  const { id } = req.params;
  const {
    EmployeeName,
    VehicleReg,
    CompanyName,
    JobID,
    PermitNo,
    WeightDocNo,
    DeliveryDate,
    Rate,
    Gross,
    Tare,
    Origin,
    Destination,
    Archived,
    OutgoingInvoiceNo,
    UnitType,
    UnitQuantity,
    Paid,
    Checked,
    PermitURL,
    WeightDocURL,
    PaperDocFiled,
    MobileUL,
    Purchase
  } = req.body;

  try {
    let EmployeeID, VehicleID, CompanyID;

    if (EmployeeName) {
      const employeeResult = await sql.query`SELECT EmployeeID FROM tblEmployee WHERE EmployeeName = ${EmployeeName}`;
      if (employeeResult.recordset.length === 0) {
        return res.status(404).json({ message: 'Employee not found.' });
      }
      EmployeeID = employeeResult.recordset[0].EmployeeID;
    }

    if (VehicleReg) {
      const vehicleResult = await sql.query`SELECT VehicleID FROM tblVehicle WHERE VehicleReg = ${VehicleReg}`;
      if (vehicleResult.recordset.length === 0) {
        return res.status(404).json({ message: 'Vehicle not found.' });
      }
      VehicleID = vehicleResult.recordset[0].VehicleID;
    }

    if (CompanyName) {
      const companyResult = await sql.query`SELECT CompanyID FROM tblCompanies WHERE CompanyName = ${CompanyName}`;
      if (companyResult.recordset.length === 0) {
        return res.status(404).json({ message: 'Company not found.' });
      }
      CompanyID = companyResult.recordset[0].CompanyID;
    }

    const updateFields = [];
    const updateValues = {};

    if (EmployeeID) {
      updateFields.push('EmployeeID = @EmployeeID');
      updateValues.EmployeeID = EmployeeID;
    }
    if (VehicleID) {
      updateFields.push('VehicleID = @VehicleID');
      updateValues.VehicleID = VehicleID;
    }
    if (CompanyID) {
      updateFields.push('CompanyID = @CompanyID');
      updateValues.CompanyID = CompanyID;
    }
    if (JobID) {
      updateFields.push('JobID = @JobID');
      updateValues.JobID = JobID;
    }
    if (PermitNo) {
      updateFields.push('PermitNo = @PermitNo');
      updateValues.PermitNo = PermitNo;
    }
    if (WeightDocNo) {
      updateFields.push('WeightDocNo = @WeightDocNo');
      updateValues.WeightDocNo = WeightDocNo;
    }
    if (DeliveryDate) {
      updateFields.push('DeliveryDate = @DeliveryDate');
      updateValues.DeliveryDate = DeliveryDate;
    }
    if (Rate) {
      updateFields.push('Rate = @Rate');
      updateValues.Rate = Rate;
    }
    if (Gross) {
      updateFields.push('Gross = @Gross');
      updateValues.Gross = Gross;
    }
    if (Tare) {
      updateFields.push('Tare = @Tare');
      updateValues.Tare = Tare;
    }
    if (Origin) {
      updateFields.push('Origin = @Origin');
      updateValues.Origin = Origin;
    }
    if (Destination) {
      updateFields.push('Destination = @Destination');
      updateValues.Destination = Destination;
    }
    if (Archived !== undefined) {
      updateFields.push('Archived = @Archived');
      updateValues.Archived = Archived;
    }
    if (OutgoingInvoiceNo) {
      updateFields.push('OutgoingInvoiceNo = @OutgoingInvoiceNo');
      updateValues.OutgoingInvoiceNo = OutgoingInvoiceNo;
    }
    if (UnitType) {
      updateFields.push('UnitType = @UnitType');
      updateValues.UnitType = UnitType;
    }
    if (UnitQuantity) {
      updateFields.push('UnitQuantity = @UnitQuantity');
      updateValues.UnitQuantity = UnitQuantity;
    }
    if (Paid !== undefined) {
      updateFields.push('Paid = @Paid');
      updateValues.Paid = Paid;
    }
    if (Checked !== undefined) {
      updateFields.push('Checked = @Checked');
      updateValues.Checked = Checked;
    }
    if (PermitURL) {
      updateFields.push('PermitURL = @PermitURL');
      updateValues.PermitURL = PermitURL;
    }
    if (WeightDocURL) {
      updateFields.push('WeightDocURL = @WeightDocURL');
      updateValues.WeightDocURL = WeightDocURL;
    }
    if (PaperDocFiled !== undefined) {
      updateFields.push('PaperDocFiled = @PaperDocFiled');
      updateValues.PaperDocFiled = PaperDocFiled;
    }
    if (MobileUL) {
      updateFields.push('MobileUL = @MobileUL');
      updateValues.MobileUL = MobileUL;
    }
    if (Purchase) {
      updateFields.push('Purchase = @Purchase');
      updateValues.Purchase = Purchase;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update.' });
    }

    const updateQuery = `
      UPDATE tblLoads
      SET ${updateFields.join(', ')}
      WHERE ID = @id`;

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
    res.status(500).json({ message: 'Failed to update load', error: err.message });
  }
};

exports.updateInvoiceNo = async (req, res) => {
    const { id, invoiceNo } = req.body;

    try {
        const result = await sql.query`
            UPDATE tblLoads
            SET InvoiceNo = ${invoiceNo}
            WHERE ID = ${id}`;

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Load not found." });
        }

        res.json({ message: "Outgoing Invoice No updated successfully." });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update Outgoing Invoice No', error: err.message });
    }
};

exports.clearInvoiceNo = async (req, res) => {
    const { invoiceNo } = req.body;

    try {
        const result = await sql.query`
            UPDATE tblLoads
            SET InvoiceNo = NULL
            WHERE InvoiceNo = ${invoiceNo}`;

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "No loads found with the specified invoice number." });
        }

        res.json({ message: "Invoice No cleared successfully." });
    } catch (err) {
        res.status(500).json({ message: 'Failed to clear Invoice No', error: err.message });
    }
};

exports.deleteLoadById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await sql.query`
            UPDATE tblLoads SET Void = 1 WHERE ID = ${id}`;

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Load not found." });
        }

        res.json({ message: "Load removed successfully." });
    } catch (err) {
        res.status(500).json({ message: 'Failed to remove load', error: err.message });
    }
};

exports.getAllNonArchivedLoads = async (req, res) => {
    try {
        const result = await sql.query`
            SELECT 
                l.ID,
                l.SubmissionID,
                l.InvoiceNo,
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
                l.Archived,
                l.Purchase
            FROM tblLoads l
            LEFT JOIN tblCompanies c ON l.CompanyID = c.CompanyID
            LEFT JOIN tblEmployee e ON l.EmployeeID = e.EmployeeID
            LEFT JOIN tblVehicle v ON l.VehicleID = v.VehicleID
            WHERE l.Archived = 0 AND l.Void = 0
            ORDER BY l.ID DESC;`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch records', error: err.message });
    }
};

exports.addLinkLoad = async (req, res) => {
    const { loadID, companyName, linkNo, rate, purchase } = req.body;

    try {
        // Get CompanyID from companyName
        const companyResult = await sql.query`SELECT CompanyID FROM tblCompanies WHERE CompanyName = ${companyName}`;
        
        if (companyResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Company not found.' });
        }

        const companyID = companyResult.recordset[0].CompanyID;

        // Insert into tblLinkLoads
        await sql.query`
            INSERT INTO tblLinkLoads (LoadID, CompanyID, LinkNo, Rate, Purchase)
            VALUES (${loadID}, ${companyID}, ${linkNo || null}, ${rate}), ${purchase}`;

        res.status(201).json({ message: 'Link load added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add link load', error: err.message });
    }
};

exports.updateLinkLoad = async (req, res) => {
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
            return res.status(404).json({ message: "Link load not found." });
        }

        res.json({ message: "Link load updated successfully." });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update link load', error: err.message });
    }
};

exports.getExternalLoads = async (req, res) => {
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
            return res.status(404).json({ message: "No loads found for the specified criteria." });
        }

        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch records', error: err.message });
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
        res.status (500).json({ message: 'Failed to update Link Invoice No', error: err.message });
    }
};

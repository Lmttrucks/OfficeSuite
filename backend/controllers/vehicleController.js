const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: { encrypt: true },
};

exports.addVehicle = async (req, res) => {
    const { IsTruck, IsTrailer, VehicleReg, Type, Make, Model, Chassis, PurchaseDate, PurchasePrice, CurrentValue, NetWeight, CraneCert, CVRT, Tacho, Tax, Status, UserID, DateAdded } = req.body;
    const query = `INSERT INTO [dbo].[tblVehicle] (IsTruck, IsTrailer, VehicleReg, Type, Make, Model, Chassis, PurchaseDate, PurchasePrice, CurrentValue, NetWeight, CraneCert, CVRT, Tacho, Tax, Status, UserID, DateAdded) 
                   VALUES (@IsTruck, @IsTrailer, @VehicleReg, @Type, @Make, @Model, @Chassis, @PurchaseDate, @PurchasePrice, @CurrentValue, @NetWeight, @CraneCert, @CVRT, @Tacho, @Tax, @Status, @UserID, @DateAdded)`;

    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('IsTruck', sql.Bit, IsTruck)
            .input('IsTrailer', sql.Bit, IsTrailer)
            .input('VehicleReg', sql.NVarChar, VehicleReg)
            .input('Type', sql.NVarChar, Type)
            .input('Make', sql.NVarChar, Make)
            .input('Model', sql.NVarChar, Model)
            .input('Chassis', sql.NVarChar, Chassis)
            .input('PurchaseDate', sql.Date, PurchaseDate)
            .input('PurchasePrice', sql.Decimal, PurchasePrice)
            .input('CurrentValue', sql.Decimal, CurrentValue)
            .input('NetWeight', sql.Decimal, NetWeight)
            .input('CraneCert', sql.Date, CraneCert)
            .input('CVRT', sql.Date, CVRT)
            .input('Tacho', sql.Date, Tacho)
            .input('Tax', sql.Date, Tax)
            .input('Status', sql.NVarChar, Status)
            .input('UserID', sql.Int, UserID)
            .input('DateAdded', sql.Date, DateAdded)
            .query(query);

        res.status(201).json({ message: 'Vehicle added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.editVehicle = async (req, res) => {
    const { id } = req.params;
    const { IsTruck, IsTrailer, VehicleReg, Type, Make, Model, Chassis, PurchaseDate, PurchasePrice, CurrentValue, NetWeight, CraneCert, CVRT, Tacho, Tax, Status, UserID, DateAdded } = req.body;
    const query = `UPDATE [dbo].[tblVehicle] SET IsTruck = @IsTruck, IsTrailer = @IsTrailer, VehicleReg = @VehicleReg, Type = @Type, Make = @Make, Model = @Model, Chassis = @Chassis, PurchaseDate = @PurchaseDate, PurchasePrice = @PurchasePrice, CurrentValue = @CurrentValue, NetWeight = @NetWeight, CraneCert = @CraneCert, CVRT = @CVRT, Tacho = @Tacho, Tax = @Tax, Status = @Status, UserID = @UserID, DateAdded = @DateAdded WHERE VehicleID = @VehicleID`;

    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('IsTruck', sql.Bit, IsTruck)
            .input('IsTrailer', sql.Bit, IsTrailer)
            .input('VehicleReg', sql.NVarChar, VehicleReg)
            .input('Type', sql.NVarChar, Type)
            .input('Make', sql.NVarChar, Make)
            .input('Model', sql.NVarChar, Model)
            .input('Chassis', sql.NVarChar, Chassis)
            .input('PurchaseDate', sql.Date, PurchaseDate)
            .input('PurchasePrice', sql.Decimal, PurchasePrice)
            .input('CurrentValue', sql.Decimal, CurrentValue)
            .input('NetWeight', sql.Decimal, NetWeight)
            .input('CraneCert', sql.Date, CraneCert)
            .input('CVRT', sql.Date, CVRT)
            .input('Tacho', sql.Date, Tacho)
            .input('Tax', sql.Date, Tax)
            .input('Status', sql.NVarChar, Status)
            .input('UserID', sql.Int, UserID)
            .input('DateAdded', sql.Date, DateAdded)
            .input('VehicleID', sql.Int, id)
            .query(query);

        res.status(200).json({ message: 'Vehicle updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteVehicle = async (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM [dbo].[tblVehicle] WHERE VehicleID = @VehicleID`;

    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('VehicleID', sql.Int, id)
            .query(query);

        res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

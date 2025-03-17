const { exec } = require('child_process');
require('dotenv').config();

exports.backupDatabaseAndBlobStorage = async (req, res) => {
    try {
        const dbBackupCommand = `sqlcmd -S ${process.env.DB_SERVER} -U ${process.env.DB_USER} -P ${process.env.DB_PASSWORD} -Q "BACKUP DATABASE [${process.env.DB_NAME}] TO DISK='C:\\backups\\${process.env.DB_NAME}.bak'"`;
        exec(dbBackupCommand, (error, stdout, stderr) => {
            if (error || stderr) {
                return res.status(500).json({ message: 'Failed to backup database', error: error?.message || stderr });
            }

            const blobBackupCommand = `az storage blob download-batch -d "C:\\backups\\blobstorage" --account-name ${process.env.AZURE_STORAGE_ACCOUNT} --account-key ${process.env.AZURE_STORAGE_KEY} -s ${process.env.AZURE_STORAGE_BACKUP_CONTAINER}`;
            exec(blobBackupCommand, (error, stdout, stderr) => {
                if (error || stderr) {
                    return res.status(500).json({ message: 'Failed to backup blob storage', error: error?.message || stderr });
                }
                res.status(200).json({ message: 'Database and blob storage backed up successfully' });
            });
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

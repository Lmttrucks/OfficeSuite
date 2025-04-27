const { BlobServiceClient } = require('@azure/storage-blob');
const logger = require('../utils/logger'); // Import the logger utility
require('dotenv').config();

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);

exports.uploadImage = async (req, res) => {
    logger.log('Received: Upload image request with file:', req.file?.originalname);
    const containerName = 'your-container-name';
    const containerClient = blobServiceClient.getContainerClient(containerName);

    try {
        const blobName = req.file.originalname;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(req.file.buffer, {
            blobHTTPHeaders: { blobContentType: req.file.mimetype },
        });

        logger.log('Sent: Image uploaded successfully with URL:', blockBlobClient.url);
        res.status(200).json({ message: 'Image uploaded successfully', url: blockBlobClient.url });
    } catch (err) {
        logger.log('Error: Failed to upload image', err.message);
        res.status(500).json({ message: 'Failed to upload image', error: err.message });
    }
};

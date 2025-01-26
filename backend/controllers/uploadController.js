const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);

exports.uploadImage = async (req, res) => {
    const containerName = 'your-container-name';
    const containerClient = blobServiceClient.getContainerClient(containerName);

    try {
        const blobName = req.file.originalname;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(req.file.buffer, {
            blobHTTPHeaders: { blobContentType: req.file.mimetype },
        });

        res.status(200).json({ message: 'Image uploaded successfully', url: blockBlobClient.url });
    } catch (err) {
        res.status(500).json({ message: 'Failed to upload image', error: err.message });
    }
};

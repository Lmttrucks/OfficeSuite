const express = require('express');
const router = express.Router();

router.get('/Upload-info', (req, res) => {
    res.json({ message: 'Upload is operational' });
});

module.exports = router;

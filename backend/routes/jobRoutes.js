const express = require('express');
const router = express.Router();
const { JobsDefaults, getAllJobs, getJobById, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, authorizeRoles(['admin', 'manager']), getAllJobs);
router.get('/:jobID', authenticateToken, authorizeRoles(['admin', 'manager']), getJobById);
router.post('/', authenticateToken, authorizeRoles(['admin']), createJob);
router.put('/:jobID', authenticateToken, authorizeRoles(['admin']), updateJob);
router.delete('/:jobID', authenticateToken, authorizeRoles(['admin']), deleteJob);
router.get('/defaults', authenticateToken, authorizeRoles(['admin', 'manager']), JobsDefaults);

module.exports = router;

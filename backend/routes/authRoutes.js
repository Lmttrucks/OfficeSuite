const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { login, register, editUser, getUsers, getUserById, deleteUser } = require('../controllers/authController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post(
    '/register',
    authenticateToken,
    authorizeRoles(['admin']),
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('userRole').notEmpty().withMessage('User role is required'),
    ],
    register
);

router.put(
    '/edit/:id',
    authenticateToken,
    authorizeRoles(['admin']),
    [
        body('username').optional().notEmpty().withMessage('Username is required'),
        body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('userRole').optional().notEmpty().withMessage('User role is required'),
        body('isActive').optional().isBoolean().withMessage('IsActive must be a boolean'),
        body('employeeID').optional().isInt().withMessage('EmployeeID must be an integer'),
        body('companyID').optional().isInt().withMessage('CompanyID must be an integer'),
        body('contactID').optional().isInt().withMessage('ContactID must be an integer'),
    ],
    editUser
);

router.get(
    '/users',
    authenticateToken,
    authorizeRoles(['admin']),
    getUsers
);

router.get(
    '/user/:id',
    authenticateToken,
    authorizeRoles(['admin']),
    getUserById
);

router.delete(
    '/delete/:id',
    authenticateToken,
    authorizeRoles(['admin']),
    deleteUser
);

module.exports = router;

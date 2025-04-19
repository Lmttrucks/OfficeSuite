const jwt = require('jsonwebtoken');
const logger = require('../utils/logger'); // Import the logger utility
require('dotenv').config();

exports.authenticateToken = (req, res, next) => {
    logger.log('Received: Authenticate token request with Authorization header:', req.header('Authorization'));
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        logger.log('Sent: Access denied. No token provided.');
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        logger.log('Sent: Token authenticated successfully for user:', decoded);
        next();
    } catch (ex) {
        logger.log('Sent: Invalid token.');
        res.status(400).json({ message: 'Invalid token.' });
    }
};

exports.authorizeRoles = (roles) => {
    return (req, res, next) => {
        logger.log('Received: Authorize roles request for user:', req.user, 'with required roles:', roles);
        if (!roles.includes(req.user.role)) {
            logger.log('Sent: Access denied. User does not have the required role.');
            return res.status(403).json({ message: 'Access denied. You do not have the required role.' });
        }
        logger.log('Sent: User authorized successfully for role:', req.user.role);
        next();
    };
};

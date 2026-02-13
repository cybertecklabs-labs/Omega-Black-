const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ success: false, error: 'Not authorized' });
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
    }
};

exports.authorize = (...roles) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, error: 'Not authorized' });
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }
    next();
};

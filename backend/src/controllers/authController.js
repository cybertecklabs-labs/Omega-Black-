const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { validationResult } = require('express-validator');

const generateToken = (id) => jwt.sign({ id }, config.jwtSecret, { expiresIn: '30d' });

exports.register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
        const { email, username, password } = req.body;
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) return res.status(400).json({ success: false, error: 'User already exists' });
        const user = await User.create({ email, username, password });
        res.status(201).json({
            success: true,
            data: { id: user._id, email, username, token: generateToken(user._id) }
        });
    } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        res.json({
            success: true,
            data: { id: user._id, email: user.email, username: user.username, role: user.role, token: generateToken(user._id) }
        });
    } catch (error) { next(error); }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ success: true, data: user });
    } catch (error) { next(error); }
};

const Target = require('../models/Target');

exports.getTargets = async (req, res, next) => {
    try {
        const targets = await Target.find().populate('owner', 'username');
        res.json({ success: true, data: targets });
    } catch (error) { next(error); }
};

exports.createTarget = async (req, res, next) => {
    try {
        const target = await Target.create({ ...req.body, owner: req.user.id });
        res.status(201).json({ success: true, data: target });
    } catch (error) { next(error); }
};

exports.startRecon = async (req, res, next) => {
    try {
        const target = await Target.findById(req.params.id);
        if (!target) return res.status(404).json({ success: false, error: 'Target not found' });
        // In production: trigger async job (BullMQ, n8n, etc.)
        target.metadata.lastRecon = new Date();
        await target.save();
        res.status(202).json({ success: true, message: 'Recon started', jobId: 'mock-job-id' });
    } catch (error) { next(error); }
};

exports.getReconStatus = async (req, res, next) => {
    try {
        const target = await Target.findById(req.params.id).select('metadata');
        res.json({ success: true, data: target.metadata });
    } catch (error) { next(error); }
};

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

const reconService = require('../services/reconService');

exports.startRecon = async (req, res, next) => {
    try {
        const target = await Target.findById(req.params.id);
        if (!target) return res.status(404).json({ success: false, error: 'Target not found' });

        // Asynchronously start recon
        target.metadata.status = 'scanning';
        target.metadata.lastRecon = new Date();
        await target.save();

        // Perform recon (in a real production app, this would be a background task)
        reconService.runSubfinder(target.domain).then(subdomains => {
            target.metadata.subdomains = subdomains;
            target.metadata.status = 'completed';
            target.save();
        });

        res.status(202).json({ success: true, message: 'Reconnaissance initiated', targetId: target._id });
    } catch (error) { next(error); }
};

exports.getReconStatus = async (req, res, next) => {
    try {
        const target = await Target.findById(req.params.id).select('metadata');
        res.json({ success: true, data: target.metadata });
    } catch (error) { next(error); }
};

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const n8nService = require('../services/n8nService');

router.get('/workflows', protect, authorize('admin'), async (req, res, next) => {
    try {
        const workflows = await n8nService.listWorkflows();
        res.json({ success: true, data: workflows });
    } catch (error) { next(error); }
});

router.post('/workflows/:id/execute', protect, authorize('admin'), async (req, res, next) => {
    try {
        const result = await n8nService.triggerWorkflow(req.params.id, req.body);
        res.json({ success: true, data: result });
    } catch (error) { next(error); }
});

module.exports = router;

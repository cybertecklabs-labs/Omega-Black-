const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { runAgent } = require('../services/aiAgentService');

router.post('/chat', protect, async (req, res, next) => {
    try {
        const { task } = req.body;
        const result = await runAgent(task);
        res.json({ success: true, data: result });
    } catch (error) { next(error); }
});

module.exports = router;

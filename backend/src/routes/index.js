const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/vulnerabilities', require('./vulnerabilityRoutes'));
router.use('/targets', require('./targetRoutes'));
router.use('/agent', require('./agentRoutes'));
router.use('/n8n', require('./n8nRoutes'));

module.exports = router;

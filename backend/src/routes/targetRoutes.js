const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const {
    getTargets,
    createTarget,
    startRecon,
    getReconStatus
} = require('../controllers/targetController');

router.route('/')
    .get(protect, getTargets)
    .post(protect, createTarget);

router.post('/:id/recon', protect, authorize('admin', 'hunter'), startRecon);
router.get('/:id/recon', protect, getReconStatus);

module.exports = router;

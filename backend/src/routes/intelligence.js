/**
 * Intelligence & Orchestration Routes
 * API Boundary for OMEGA BLACK
 */
function createIntelligenceRouter({ orchestrator, graph }) {
    const router = require('express').Router();

    /**
     * POST /api/scan
     * Launch an autonomous scan mission
     */
    router.post('/scan', async (req, res, next) => {
        try {
            const { target, ...params } = req.body;
            if (!target) return res.status(400).json({ error: "Target is required" });

            const result = await orchestrator.planScan({ target, params });

            // 202 Accepted if started, or 200 OK if existing/skipped
            res.status(result.status === 'started' ? 202 : 200).json(result);
        } catch (err) {
            next(err);
        }
    });

    /**
     * GET /api/scan/:id
     * Check mission status
     */
    router.get('/scan/:id', (req, res) => {
        const status = orchestrator.getPipelineStatus(req.params.id);
        if (status.status === 'unknown') return res.status(404).json({ error: "Mission not found" });
        res.json(status);
    });

    /**
     * GET /api/graph/visualization
     * Get graph nodes and edges for dashboard
     */
    router.get('/graph/visualization', async (req, res, next) => {
        try {
            // In a real implementation, this would query the DB for the graph structure
            // For now, returning a mock structure compatible with the requested format
            // or querying limited assets
            const data = {
                nodes: [],
                edges: []
            };
            res.json(data);
        } catch (err) {
            next(err);
        }
    });

    /**
     * GET /api/health/intelligence
     * Check brain health
     */
    router.get('/health/intelligence', async (req, res) => {
        const healthy = await graph.healthCheck();
        if (healthy) res.json({ status: "online", system: "OMEGA CORTEX" });
        else res.status(503).json({ status: "offline", error: "Brain disconnected" });
    });

    return router;
}

module.exports = { createIntelligenceRouter };

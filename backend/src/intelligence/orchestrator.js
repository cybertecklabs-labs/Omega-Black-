const { IntelligenceGraph } = require('./graph');

/**
 * Autonomous Orchestrator - The OS Kernel
 * Manages scan lifecycles, retries, and AI-driven decision making.
 */
class AutonomousOrchestrator {
    constructor({ graph, temporal, logger, thresholds }) {
        this.graph = graph;
        this.temporal = temporal;
        this.logger = logger || console;
        this.thresholds = thresholds || { escalation: 0.8 };
        this.activePipelines = new Map(); // In-memory state (use Redis/DB in production)
    }

    /**
     * Launch a fully autonomous recon pipeline
     * @param {string} target - e.g. "example.com"
     * @param {object} params - Scan parameters
     */
    async planScan({ target, params = {} }) {
        const mode = params.mode || "full";
        this.logger.info(`[ORCHESTRATOR] 🚀 Planning mission for ${target} (${mode})`);

        // 1. Idempotency Check
        // Check in-memory map first (in prod, check a jobs table)
        for (const [id, job] of this.activePipelines.entries()) {
            if (job.targetId === target && job.status === 'running') {
                this.logger.warn(`[ORCHESTRATOR] 🛑 Scan already running for ${target} (Job: ${id})`);
                return { status: "skipped", reason: "duplicate_scan_running", oldJobId: id };
            }
        }

        // 2. Check Intelligence Graph for recent history
        const existing = await this.graph.getAsset(target);
        if (existing && existing.last_seen && !params.force) {
            const timeDiff = Date.now() - new Date(existing.last_seen).getTime();
            if (timeDiff < 86400000) { // 24 hours
                this.logger.warn(`[ORCHESTRATOR] 🛑 Recent scan found for ${target} (${Math.floor(timeDiff / 3600000)}h ago)`);
                return { status: "skipped", reason: "recent_scan_exists" };
            }
        }

        // 3. Determine workflow
        const workflowId = `scan-${target.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}`;
        const workflowName = mode === "monitoring" ? "MonitorAsset" : "FullRecon";

        // 4. Trigger Temporal Workflow
        try {
            await this.temporal.start(workflowName, {
                args: [target, { deep: mode === "full", ...params }],
                taskQueue: 'omega-bridge-queue',
                workflowId: workflowId
            });

            this.activePipelines.set(workflowId, { targetId: target, status: "running", started: new Date() });

            this.logger.info(`[ORCHESTRATOR] ✅ Pipeline started: ${workflowId}`);
            return { status: "started", pipelineId: workflowId };
        } catch (error) {
            this.logger.error(`[ORCHESTRATOR] 💥 Failed to start pipeline: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get real-time status of a specific pipeline
     * @param {string} pipelineId - The ID of the pipeline
     * @returns {object} Current status of the pipeline
     */
    getPipelineStatus(pipelineId) {
        return this.activePipelines.get(pipelineId) || { status: "unknown", reason: "not_found" };
    }

    /**
     * Update the status of a pipeline (e.g., from Temporal callback)
     * @param {string} pipelineId - The ID of the pipeline
     * @param {object} statusUpdate - Object containing status fields to update
     */
    updatePipelineStatus(pipelineId, statusUpdate) {
        const current = this.activePipelines.get(pipelineId);
        if (current) {
            this.activePipelines.set(pipelineId, { ...current, ...statusUpdate });
            this.logger.debug(`[ORCHESTRATOR] Pipeline ${pipelineId} status updated: ${JSON.stringify(statusUpdate)}`);
            return true;
        }
        this.logger.warn(`[ORCHESTRATOR] Attempted to update status for unknown pipeline: ${pipelineId}`);
        return false;
    }

    /**
     * AI Decision Loop: Should we escalate this finding?
     * @param {object} finding - Raw vulnerability report
     */
    async evaluateFinding(finding) {
        const prediction = await this.graph.predictWeaknessLikelihood(finding.assetId, finding.type);

        // Log decision context
        this.logger.info({
            event: "orchestrator.evaluate_finding",
            target: finding.assetId,
            vuln: finding.type,
            score: prediction.score,
            rationale: prediction.rationale
        });

        if (prediction.score > this.thresholds.escalation) {
            this.logger.info(`[ORCHESTRATOR] ⚡ High confidence finding! Escalating to verification.`);
            // Trigger specific exploit verification workflow logic here
            return { action: "escalated", score: prediction.score };
        }

        return { action: "logged", score: prediction.score };
    }
}

function createAutonomousOrchestrator(deps) {
    return new AutonomousOrchestrator(deps);
}

module.exports = { createAutonomousOrchestrator, AutonomousOrchestrator };

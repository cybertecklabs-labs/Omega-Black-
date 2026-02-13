const { Workflow } = require('@temporalio/workflow');
const { runNucleiScan } = require('../activities/nuclei');

// Simple Workflow to run a scan and optionally save results
exports.NucleiScanWorkflow = async (target, templates) => {
    // 1. Run the scan activity with retry policy
    const result = await Workflow.executeActivity(runNucleiScan, [target, templates], {
        scheduleToCloseTimeout: '5m',
        retry: {
            initialInterval: '1s',
            maximumAttempts: 3,
        },
    });

    if (!result.success) {
        // 2a. Handle failure (e.g., notify operator)
        Workflow.log(`Scan failed for ${target}: ${result.error}`);
        return { status: 'failed', findings: 0 };
    }

    // 2b. Process findings
    const criticals = result.findings.filter(f => f.info?.severity === 'critical');
    if (criticals.length > 0) {
        Workflow.log(`CRITICAL FINDINGS FOUND: ${criticals.length} on ${target}`);
    }

    return { status: 'completed', findings: result.findings.length, criticals: criticals.length };
};

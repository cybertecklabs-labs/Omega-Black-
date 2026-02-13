const { execFile } = require('child_process');
const util = require('util');
const promClient = require('prom-client');

// Instrumentation
const scansTotal = new promClient.Counter({
    name: 'nuclei_scans_total',
    help: 'Total Nuclei scans executed',
    labelNames: ['status', 'severity']
});

const findingsTotal = new promClient.Counter({
    name: 'nuclei_findings_total',
    help: 'Total Nuclei findings reported',
    labelNames: ['severity', 'template']
});

exports.runNucleiScan = async (target, templates = []) => {
    // Security: Whitelist templates to prevent arbitrary file access if user-supplied
    const safeTemplates = templates.filter(t => /^[a-zA-Z0-9_\-\/]+$/.test(t));

    // Construct arguments securely
    const args = ['-u', target, '-json', '-silent'];
    if (safeTemplates.length > 0) {
        args.push('-t', ...safeTemplates);
    } else {
        // Default to basic recon if no templates specified
        args.push('-t', 'http/technologies');
    }

    return new Promise((resolve, reject) => {
        // 🛡️ Security Contract: execFile ONLY
        execFile('nuclei', args, {
            maxBuffer: 1024 * 1024 * 10, // 10MB limit
            timeout: 300000 // 5 minute timeout per scan
        }, (error, stdout, stderr) => {
            if (error) {
                scansTotal.inc({ status: 'failed', severity: 'unknown' });
                console.error(`Nuclei Scan Error: ${stderr || error.message}`);
                // Don't reject, return error state so workflow can handle it gracefully (e.g. retry)
                return resolve({ success: false, error: error.message, findings: [] });
            }

            const findings = stdout.trim().split('\n').filter(line => line).map(line => {
                try {
                    const finding = JSON.parse(line);
                    findingsTotal.inc({ severity: finding.info?.severity || 'info', template: finding['template-id'] });
                    return finding;
                } catch (e) { return null; }
            }).filter(f => f);

            scansTotal.inc({ status: 'success', severity: 'mixed' });
            resolve({ success: true, findings });
        });
    });
};

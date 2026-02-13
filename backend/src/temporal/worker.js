const { Worker } = require('@temporalio/worker');
const activities = require('./activities/nuclei');

// Bridge Worker: Runs in Docker, connects to the Bridge network
async function run() {
    const connection = {
        address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
        // ... TLS config if production
    };

    const worker = await Worker.create({
        connection,
        namespace: process.env.TEMPORAL_NAMESPACE || 'default',
        taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'omega-bridge-queue',
        activities,
        shutdownGraceTime: '10s',
    });

    console.log('🛡️ Nuclei Scan Worker started. Listening for tasks...');
    await worker.run();
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});

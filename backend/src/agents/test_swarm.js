const { AgentBus, CortexAgent, ReconAgent } = require('./core');
const { createIntelligenceGraph } = require('../intelligence/graph');

async function testSwarm() {
    console.log("[SWARM] ⚡ Initializing Agent System...");

    // 1. Swarm Infrastructure
    const bus = new AgentBus();
    const memory = createIntelligenceGraph({ pool: {}, logger: console }); // Mock pool for demo

    // 2. Spawn Agents
    const cortex = new CortexAgent({ bus, memory });
    const recon1 = new ReconAgent({ bus, memory, name: 'SUBFINDER_ALPHA' });
    const recon2 = new ReconAgent({ bus, memory, name: 'SUBFINDER_BETA' });

    // 3. Register Squad
    cortex.registerAgent(recon1);
    cortex.registerAgent(recon2);

    // 4. Listen to the Hive Mind
    bus.on('*', (msg) => {
        console.log(`[BUS] 📡 ${msg.type.padEnd(20)} from ${msg.source}:`, msg.payload);
    });

    // 5. Execute Autonomous Mission
    console.log("\n[SWARM] 🚀 CORTEX: Analyzing target 'example.com'...");
    await cortex.analyzeTarget('example.com');

    // Keep alive briefly to see async responses
    await new Promise(r => setTimeout(r, 2000));
}

// Ensure proper error handling if executed directly
if (require.main === module) {
    testSwarm().catch(console.error);
}

module.exports = { testSwarm };

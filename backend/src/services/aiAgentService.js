const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/config');
const Vulnerability = require('../models/Vulnerability');
const Target = require('../models/Target');

let genAI, model;
if (config.geminiApiKey) {
    genAI = new GoogleGenerativeAI(config.geminiApiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-pro' });
}

const tools = {
    async searchVulnerabilities(query) {
        return Vulnerability.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }).limit(5).lean();
    },
    async getTargetInfo(targetId) {
        return Target.findById(targetId).lean();
    },
    async suggestExploit(cve) {
        return `Exploit for ${cve} – check Metasploit, Exploit-DB, or NVD.`;
    },
    async runRecon(targetDomain) {
        return `Recon job queued for ${targetDomain}.`;
    }
};

exports.runAgent = async (taskDescription) => {
    if (!model) throw new Error('Gemini API key required');
    const systemPrompt = `You are OMEGA, an autonomous AI security assistant.
Tools: searchVulnerabilities(query), getTargetInfo(targetId), suggestExploit(cve), runRecon(targetDomain)
Output JSON: {"thought": "...", "action": "toolName|final", "actionInput": "..."}
When you have the final answer, set action to "final".`;
    let messages = [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'user', parts: [{ text: `Task: ${taskDescription}` }] }
    ];
    let maxIter = 10;
    let finalAnswer = null;
    for (let i = 0; i < maxIter; i++) {
        const result = await model.generateContent({ contents: messages });
        const text = result.response.text();
        let parsed;
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            parsed = JSON.parse(jsonMatch[0]);
        } catch {
            parsed = { action: 'final', actionInput: text };
        }
        const { thought, action, actionInput } = parsed;
        if (action === 'final') {
            finalAnswer = actionInput;
            break;
        }
        let observation = 'Tool not found';
        if (tools[action]) {
            try {
                const result = await tools[action](actionInput);
                observation = JSON.stringify(result);
            } catch (err) {
                observation = `Error: ${err.message}`;
            }
        }
        messages.push({
            role: 'model',
            parts: [{ text: JSON.stringify({ thought, action, actionInput, observation }) }]
        });
    }
    return { task: taskDescription, answer: finalAnswer || 'No final answer reached', iterations: messages.length };
};

const axios = require('axios');
const config = require('../config/config');

const n8nClient = axios.create({
    baseURL: `${config.n8nBaseUrl}/api/v1`,
    headers: { 'X-N8N-API-KEY': config.n8nApiKey, 'Content-Type': 'application/json' }
});

exports.listWorkflows = async () => {
    const res = await n8nClient.get('/workflows');
    return res.data.data;
};

exports.triggerWorkflow = async (workflowId, payload = {}) => {
    const res = await n8nClient.post(`/workflows/${workflowId}/execute`, payload);
    return res.data;
};

exports.getExecution = async (executionId) => {
    const res = await n8nClient.get(`/executions/${executionId}`);
    return res.data;
};

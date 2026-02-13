const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/config');
const axios = require('axios');

let genAI, model;
if (config.geminiApiKey) {
    genAI = new GoogleGenerativeAI(config.geminiApiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-pro' });
}

exports.analyzeWithGemini = async (description) => {
    if (!model) throw new Error('Gemini API key not configured');
    const prompt = `You are an AI vulnerability analyst. Analyze the following bug description and return a JSON with:
  - severity (critical/high/medium/low/info)
  - cvssScore (0-10)
  - confidence (0-1)
  - explanation (short reasoning)
  
  Description: "${description}"`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    try {
        return JSON.parse(text);
    } catch {
        return { raw: text };
    }
};

exports.analyzeWithOllama = async (description, modelName = 'mistral:7b-instruct-q4_K_M') => {
    const response = await axios.post(`${config.ollamaBaseUrl}/api/generate`, {
        model: modelName,
        prompt: `Analyze this vulnerability: ${description}`,
        stream: false
    });
    return response.data;
};

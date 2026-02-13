const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    geminiApiKey: process.env.GEMINI_API_KEY,
    ollamaBaseUrl: process.env.OLLAMA_BASE_URL,
    n8nBaseUrl: process.env.N8N_BASE_URL,
    n8nApiKey: process.env.N8N_API_KEY,
};

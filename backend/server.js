const app = require('./app');
const config = require('./src/config/config');

const PORT = config.port || 5000;

const server = app.listen(PORT, () => {
    console.log(`🚀 OMEGA BLACK backend running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => process.exit(1));
});

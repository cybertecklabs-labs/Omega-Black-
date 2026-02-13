const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middlewares/errorHandler');
const routes = require('./src/routes');

const rateLimit = require('express-rate-limit');

connectDB();

const app = express();


// 🔭 Observability: Prometheus Metrics
const client = require('prom-client');
const registry = new client.Registry();
client.collectDefaultMetrics({ register: registry });

const requests = new client.Counter({
    name: 'bridge_requests_total',
    help: 'Total bridge requests',
    labelNames: ['status', 'route'],
});
registry.registerMetric(requests);

const latency = new client.Histogram({
    name: 'bridge_latency_seconds',
    help: 'Bridge request latency',
    labelNames: ['route'],
    buckets: [0.1, 0.5, 1, 3, 5],
});
registry.registerMetric(latency);

// Metrics Middleware
app.use((req, res, next) => {
    if (req.path === '/metrics') return next();
    const end = latency.startTimer({ route: req.path });
    res.on('finish', () => {
        requests.inc({
            status: res.statusCode,
            route: req.path,
        });
        end();
    });
    next();
});

// Expose Metrics Endpoint (protected in production by Firewall/Tunnel, open for bridge)
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', registry.contentType);
    res.end(await registry.metrics());
});

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use('/api', limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use('/uploads', express.static('uploads'));

app.use('/api', routes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'OMEGA BLACK backend running' });
});

app.use(errorHandler);

module.exports = app;

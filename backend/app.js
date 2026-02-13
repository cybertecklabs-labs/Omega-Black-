const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middlewares/errorHandler');
const routes = require('./src/routes');

connectDB();

const app = express();

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

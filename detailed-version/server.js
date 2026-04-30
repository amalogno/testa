'use strict';

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const { httpsOnly, outputSanitizer } = require('./middlewares/security.middleware');
const { authLimiter } = require('./middlewares/rateLimit.middleware');
const logger = require('./utils/logger');
const authRoutes = require('./routes/auth.routes');
const listingRoutes = require('./routes/listing.routes');

const app = express();

connectDB();

app.use(httpsOnly);
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN, credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(outputSanitizer);

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/listings', listingRoutes);

app.use((err, req, res, next) => {
  logger.error(`Unhandled Exception - IP: ${req.ip} - Error: ${err.message}`);
  res.status(err.status || 500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Secure server running on port ${PORT}`);
});

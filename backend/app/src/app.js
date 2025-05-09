const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger setup using YAML file
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
const productRoutes = require('./routes/product.routes');
const competitorRoutes = require('./routes/competitors.routes');
app.use('/api/product', productRoutes);
app.use('/api/competitor', competitorRoutes);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;

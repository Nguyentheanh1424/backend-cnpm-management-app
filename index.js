require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require("swagger-ui-express");
const database = require('./config/dbconfig');
const logger = require('./config/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Cấu hình Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Software Engineering Management API',
            version: '1.0.0',
            description: 'Software Engineering Management API',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Development server',
            },
        ],
    },
    apis: ['./routes/*.js'],
    failOnErrors: true,
}

try {
    const swaggerDocs = swaggerJsdoc(swaggerOptions);
    logger.info('Swagger documentation initialized', { swaggerOptions });

    // Cấu hình middleware
    app.use(cors({
        origin: process.env.NODE_ENV === 'production' 
            ? process.env.FRONTEND_URL || 'https://yourdomain.com' 
            : 'http://localhost:5173', // Default Vite dev server port
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }));
    app.use(express.json());

    // Import routes
    const authRoutes = require('./routes/auth');
    const bankRoutes = require('./routes/bank');
    const calendarRoutes = require('./routes/calendar');
    const chatRoutes = require('./routes/chat');
    const productsRoutes = require('./routes/products');
    const sellRoutes = require('./routes/sell');
    const homeRoutes = require('./routes/home');

    // Use routes
    app.use('/api/auth', authRoutes);
    app.use('/api/bank', bankRoutes);
    app.use('/api/calendar', calendarRoutes);
    app.use('/api/chat', chatRoutes);
    app.use('/api/products', productsRoutes);
    app.use('/api/sell', sellRoutes);
    app.use('/api/home', homeRoutes);
    logger.info('All routes initialized');

    // Swagger route
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    logger.info('Swagger UI setup at /api-docs');

    // Kiểm tra Route
    app.get('/', (req, res) => {
        res.json({ message: `Connected to MongoDB Atlas` });
    });

} catch (err) {
    logger.error(`Swagger initialization error: ${err.message}`);
}


async function startServer() {
    try {
        // Kết nối MongoDB Atlas
        await database.connect();

        // Khởi động server
        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
            logger.info(`Swagger UI available at http://localhost:${PORT}/api-docs`);
        });
    } catch (err) {
        logger.error(`Server startup error: ${err.message}`);
        process.exit(1);
    }
}

startServer().catch((err) => {
    logger.error(`Unhandled error in startServer: ${err.message}`);
    process.exit(1);
});

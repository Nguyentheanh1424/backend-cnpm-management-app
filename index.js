require('dotenv').config();
const express = require('express');
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
    app.use(express.json());

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


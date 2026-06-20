import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Campus Placement Portal API',
      version: '1.0.0',
      description: 'AI-Powered Campus Placement Portal REST API Documentation',
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Development' },
      { url: 'https://your-backend.onrender.com', description: 'Production' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);

/**
 * swagger-jsdoc generator for FoodExpress
 */
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FoodExpress API',
      version: '1.0.0',
      description: 'FoodExpress API — users, restaurants, menus.',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: { message: { type: 'string' }, details: { type: 'object' } },
            },
          },
          example: { error: { message: 'Invalid input', details: { field: 'email' } } },
        },
        BadRequest: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: { message: { type: 'string' }, details: { type: 'object' } },
            },
          },
          example: {
            error: { message: 'Validation failed', details: { email: 'Invalid format' } },
          },
        },
        Conflict: {
          type: 'object',
          properties: { error: { type: 'object', properties: { message: { type: 'string' } } } },
          example: { error: { message: 'Resource already exists' } },
        },
        UnprocessableEntity: {
          type: 'object',
          properties: { error: { type: 'object', properties: { message: { type: 'string' } } } },
          example: {
            error: { message: 'Unprocessable entity', details: { reason: 'Invalid relationship' } },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            email: { type: 'string' },
            username: { type: 'string' },
            role: { type: 'string' },
          },
        },
        Restaurant: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            address: { type: 'string' },
            phone: { type: 'string' },
          },
        },
        Menu: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            restaurant_id: { type: 'string' },
            name: { type: 'string' },
            price: { type: 'number' },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Unauthorized',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
        NotFound: {
          description: 'Not found',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
        BadRequest: {
          description: 'Bad Request',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/BadRequest' } } },
        },
        Forbidden: {
          description: 'Forbidden',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
        Conflict: {
          description: 'Conflict',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Conflict' } } },
        },
        UnprocessableEntity: {
          description: 'Unprocessable Entity',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UnprocessableEntity' } },
          },
        },
        CreatedUser: {
          description: 'User created',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
        },
        OKUser: {
          description: 'OK',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
        },
      },
    },
  },
  apis: [
    path.join(__dirname, 'routes', '*.js'),
    path.join(__dirname, 'controllers', '*.js'),
    path.join(__dirname, 'app.js'),
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

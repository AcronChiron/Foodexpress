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
          /**
           * Static OpenAPI spec for FoodExpress (fallback when JSDoc parsing doesn't produce operations)
           */
          const swaggerSpec = {
            openapi: '3.0.0',
            info: { title: 'FoodExpress API', version: '1.0.0', description: 'FoodExpress API — users, restaurants, menus.' },
            servers: [{ url: 'http://localhost:3000' }],
            components: {
              securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
              schemas: {
                User: { type: 'object', properties: { _id: { type: 'string' }, email: { type: 'string' }, username: { type: 'string' }, role: { type: 'string' } } },
                Restaurant: { type: 'object', properties: { _id: { type: 'string' }, name: { type: 'string' }, address: { type: 'string' }, phone: { type: 'string' } } },
                Menu: { type: 'object', properties: { _id: { type: 'string' }, restaurant_id: { type: 'string' }, name: { type: 'string' }, price: { type: 'number' } } },
                Error: { type: 'object', properties: { error: { type: 'object', properties: { message: { type: 'string' } } } } },
                BadRequest: { type: 'object', properties: { error: { type: 'object', properties: { message: { type: 'string' }, details: { type: 'object' } } } } },
                Conflict: { type: 'object', properties: { error: { type: 'object', properties: { message: { type: 'string' } } } } },
                UnprocessableEntity: { type: 'object', properties: { error: { type: 'object', properties: { message: { type: 'string' } } } } },
              },
              responses: {
                Unauthorized: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                NotFound: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                BadRequest: { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/BadRequest' } } } },
                Conflict: { description: 'Conflict', content: { 'application/json': { schema: { $ref: '#/components/schemas/Conflict' } } } },
                UnprocessableEntity: { description: 'Unprocessable Entity', content: { 'application/json': { schema: { $ref: '#/components/schemas/UnprocessableEntity' } } } },
              },
            },
            paths: {
              '/health': { get: { tags: ['Auth'], summary: 'Health check', responses: { 200: { description: 'OK' } } } },
              '/auth/login': {
                post: {
                  tags: ['Auth'],
                  summary: 'Login and receive JWT token',
                  requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } } } } } },
                  responses: { 200: { description: 'Authenticated', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'object' } } } } } }, 401: { $ref: '#/components/responses/Unauthorized' } },
                },
              },
              '/users': { post: { tags: ['Users'], summary: 'Register a user', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, username: { type: 'string' }, password: { type: 'string' } } } } } }, responses: { 201: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }, 409: { $ref: '#/components/responses/Conflict' } } } },
              '/users/{id}': {
                get: { tags: ['Users'], summary: 'Get user by id', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }, 404: { $ref: '#/components/responses/NotFound' } } },
                put: { tags: ['Users'], summary: 'Update user', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } }, responses: { 200: { description: 'Updated' }, 400: { $ref: '#/components/responses/BadRequest' } } },
                delete: { tags: ['Users'], summary: 'Delete user', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 204: { description: 'No Content' }, 401: { $ref: '#/components/responses/Unauthorized' } } },
              },
              '/restaurants': {
                get: { tags: ['Restaurants'], summary: 'List restaurants', parameters: [{ name: 'page', in: 'query', schema: { type: 'integer', default: 1 } }, { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } }], responses: { 200: { description: 'OK' } } },
                post: { tags: ['Restaurants'], summary: 'Create restaurant', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Restaurant' } } } }, responses: { 201: { description: 'Created' }, 400: { $ref: '#/components/responses/BadRequest' } } },
              },
              '/restaurants/{id}': {
                get: { tags: ['Restaurants'], summary: 'Get restaurant', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Restaurant' } } } }, 404: { $ref: '#/components/responses/NotFound' } } },
                put: { tags: ['Restaurants'], summary: 'Update restaurant', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Restaurant' } } } }, responses: { 200: { description: 'Updated' } } },
                delete: { tags: ['Restaurants'], summary: 'Delete restaurant', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 204: { description: 'No Content' } } },
              },
              '/menus': { get: { tags: ['Menus'], summary: 'List menus', responses: { 200: { description: 'OK' } } }, post: { tags: ['Menus'], summary: 'Create menu', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Menu' } } } }, responses: { 201: { description: 'Created' } } } ,
              '/menus/{id}': { get: { tags: ['Menus'], summary: 'Get menu', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'OK' }, 404: { $ref: '#/components/responses/NotFound' } } }, put: { tags: ['Menus'], summary: 'Update menu', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Menu' } } } }, responses: { 200: { description: 'Updated' } } }, delete: { tags: ['Menus'], summary: 'Delete menu', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 204: { description: 'No Content' } } } 
            },
            tags: [
              { name: 'Auth', description: 'Authentication' },
              { name: 'Users', description: 'User management' },
              { name: 'Restaurants', description: 'Restaurant management' },
              { name: 'Menus', description: 'Menu management' },
            ],
          };

          module.exports = swaggerSpec;

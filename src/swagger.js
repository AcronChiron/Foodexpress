/**
 * Minimal OpenAPI 3 spec used by swagger-ui-express.
 * Contains component schemas (User, Restaurant, Menu), security scheme (Bearer JWT)
 * and a few documented paths with example curl snippets in descriptions.
 */
const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'FoodExpress API',
    version: '1.0.0',
    description: `FoodExpress API — users, restaurants, menus.

Example curl:
  curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"password"}'

Security: use Authorization: Bearer <token> for protected endpoints.
`,
  },
  servers: [{ url: 'http://localhost:3000', description: 'Local dev server' }],
  tags: [
    { name: 'Users', description: 'User registration & profile' },
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Restaurants', description: 'Restaurants listing & management' },
    { name: 'Menus', description: 'Menus listing & management' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64b...' },
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          username: { type: 'string', example: 'alice' },
          role: { type: 'string', example: 'user' },
        },
      },
      Restaurant: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          address: { type: 'string' },
          phone: { type: 'string' },
          opening_hours: { type: 'string' },
        },
      },
      Menu: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          restaurant_id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number', format: 'float' },
          category: { type: 'string' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
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
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Auth'],
        summary: 'Health check',
        responses: { 200: { description: 'OK' } },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login and receive JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { email: { type: 'string' }, password: { type: 'string' } },
              },
              example: { email: 'admin@example.com', password: 'password' },
            },
          },
        },
        responses: {
          200: {
            description: 'Authenticated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        token: { type: 'string' },
                        user: { $ref: '#/components/schemas/User' },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/users': {
      post: {
        tags: ['Users'],
        summary: 'Register a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  username: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
          },
          409: { description: 'Conflict' },
        },
      },
    },
    '/restaurants': {
      get: {
        tags: ['Restaurants'],
        summary: 'List restaurants (supports pagination)',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'sort', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/Restaurant' } },
                    meta: { type: 'object' },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Restaurants'],
        summary: 'Create restaurant (admin only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Restaurant' } } },
        },
        responses: {
          201: { description: 'Created' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/menus': {
      get: {
        tags: ['Menus'],
        summary: 'List menus (filter, sort, paginate)',
        parameters: [
          { name: 'restaurant_id', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        ],
        responses: { 200: { description: 'OK' } },
      },
    },
  },
};

module.exports = swaggerSpec;

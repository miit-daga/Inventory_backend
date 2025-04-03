import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API',
      version: '1.0.0',
      description: 'A comprehensive e-commerce API with authentication, product, order, cart, and payment functionalities',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your Bearer token in the format "Bearer {token}"',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
          },
          required: ['email', 'password'],
        },
        LoginCredentials: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' },
          },
          required: ['email', 'password'],
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'integer' },
            stock: { type: 'integer' },
            categoryId: { type: 'string' },
            brandId: { type: 'string' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
          },
        },
        Cart: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            productId: { type: 'integer' },
            quantity: { type: 'integer' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            totalAmount: { type: 'integer' },
            status: { type: 'string' },
          },
        },
        Review: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            productId: { type: 'integer' },
            rating: { type: 'integer' },
            comment: { type: 'string' },
          },
        },
        Payment: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            orderId: { type: 'string' },
            paymentMethodId: { type: 'string' },
            status: { type: 'string' },
            amount: { type: 'integer' },
          },
        },
      },
    },
    paths: {
      '/auth/signup': {
        post: {
          summary: 'Register a new user',
          tags: ['Authentication'],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          responses: {
            '201': {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AuthResponse' },
                },
              },
            },
          },
        },
      },
      '/auth/login': {
        post: {
          summary: 'Login user',
          tags: ['Authentication'],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginCredentials' },
              },
            },
          },
          responses: {
            '200': {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AuthResponse' },
                },
              },
            },
          },
        },
      },
      '/products': {
        get: {
          summary: 'Get all products',
          tags: ['Products'],
          responses: {
            '200': {
              description: 'List of products',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Product' },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Create a new product',
          tags: ['Products'],
          security: [{ BearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' },
              },
            },
          },
          responses: {
            '201': {
              description: 'Product created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Product' },
                },
              },
            },
          },
        },
      },
      '/categories': {
        get: {
          summary: 'Get all categories',
          tags: ['Categories'],
          responses: {
            '200': {
              description: 'List of categories',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Category' },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Create a new category',
          tags: ['Categories'],
          security: [{ BearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Category' },
              },
            },
          },
          responses: {
            '201': {
              description: 'Category created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Category' },
                },
              },
            },
          },
        },
      },
      '/cart': {
        get: {
          summary: 'Get cart items for a user',
          tags: ['Cart'],
          security: [{ BearerAuth: [] }],
          responses: {
            '200': {
              description: 'List of cart items',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Cart' },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Add item to cart',
          tags: ['Cart'],
          security: [{ BearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    productId: { type: 'integer' },
                    quantity: { type: 'integer' },
                  },
                  required: ['productId', 'quantity'],
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Item added to cart successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Cart' },
                },
              },
            },
          },
        },
      },
      '/orders': {
        get: {
          summary: 'Get all orders',
          tags: ['Orders'],
          security: [{ BearerAuth: [] }],
          responses: {
            '200': {
              description: 'List of orders',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Order' },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Create a new order',
          tags: ['Orders'],
          security: [{ BearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Order' },
              },
            },
          },
          responses: {
            '201': {
              description: 'Order created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Order' },
                },
              },
            },
          },
        },
      },
      '/orders/status': {
        patch: {
          summary: 'Update order status',
          tags: ['Orders'],
          security: [{ BearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    orderId: { type: 'string' },
                    status: { type: 'string' },
                  },
                  required: ['orderId', 'status'],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Order status updated successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Order' },
                },
              },
            },
          },
        },
      },
      '/reviews': {
        get: {
          summary: 'Get reviews for a product',
          tags: ['Reviews'],
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'productId',
              in: 'query',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            '200': {
              description: 'List of reviews for a product',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Review' },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Create a new review',
          tags: ['Reviews'],
          security: [{ BearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Review' },
              },
            },
          },
          responses: {
            '201': {
              description: 'Review created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Review' },
                },
              },
            },
          },
        },
      },
      '/payments': {
        get: {
          summary: 'Get all payments',
          tags: ['Payments'],
          security: [{ BearerAuth: [] }],
          responses: {
            '200': {
              description: 'List of payments',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Payment' },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Create a new payment',
          tags: ['Payments'],
          security: [{ BearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Payment' },
              },
            },
          },
          responses: {
            '201': {
              description: 'Payment created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Payment' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
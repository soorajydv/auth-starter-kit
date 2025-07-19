import { Express, response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../../package.json';
import { NODE_ENV } from './env.cofig';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Astro API Docs',
      version,
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    servers: [
      {
        url: '/api/v1', // This adds the "/api" prefix to all routes
      },
    ],
  },

  apis:
    NODE_ENV === 'development'
      ? ['docs/features/**/*.swagger.yml']
      : ['dist/docs/features/**/*.swagger.yml'],
};

const swaggerSpec = swaggerJsdoc(options);

export function swaggerDocs(app: Express, port: number) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get('docs.json', () => {
    response.setHeader('content-type', 'application/json');
    response.send(swaggerSpec);
  });

  console.log(`Docs availiable at http://localhost:${port}/docs`);
}

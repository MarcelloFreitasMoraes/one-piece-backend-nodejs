// swaggerOptions.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Personagens',
      version: '1.0.0',
      description: 'Documentação da API de personagens com Swagger',
    },
    servers: [
      {
        url: 'https://one-piece-backend-nodejs.vercel.app/', // Substitua pelo URL do seu projeto Vercel
        description: 'Servidor principal',
      },
    ],
  },
  apis: ['./index.js'], // Ou o caminho para os arquivos onde você tem as anotações Swagger
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;

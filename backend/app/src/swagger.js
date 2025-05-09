// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Title',
      version: '1.0.0',
      description: 'Your API description',
    },
    servers: [
      {
        url: 'http://localhost:5000', 
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs (adapt this to your file structure)
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;

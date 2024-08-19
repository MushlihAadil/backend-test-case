const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Eigen Library API",
      version: "1.0.0",
      description: "Swagger Eigen Library API documentation",
      contact: {
        name : 'Muhammad Mushlih Al Aadil',
        url : 'https://github.com/MushlihAadil/backend-test-case',
        email : 'mmushlih.alaadil@gmail.com'
      }
    },
    servers: [
      {
        url: process.env.SERVER_URL || "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js", "./controllers/*.js"], // Path to the API docs
};

module.exports = swaggerJsdoc(options);

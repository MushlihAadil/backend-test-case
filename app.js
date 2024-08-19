if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const cors = require("cors");
const express = require("express");
const router = require("./routes/index.js");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerConfig = require("./utils/swaggerConfig.js");
const errorHandler = require("./middlewares/errorHandlers.js");

// Using Cors
app.use(cors());

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routing
app.use(router);

// Error Handling
app.use(errorHandler)

// SwaggerAPI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerConfig));

module.exports = app
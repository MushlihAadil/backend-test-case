const express = require("express");
const router = express.Router();

router.use("/members", require('./memberRoutes'));

router.use("/books", require('./bookRoutes'));

module.exports = router;

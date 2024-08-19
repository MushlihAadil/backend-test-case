const express = require('express');
const BooksController = require('../Controllers/bookControllers');
const router = express.Router();

// Shows all existing books and quantities, books that are being borrowed are not counted.
router.get("/", BooksController.getAllBooks);

module.exports = router;
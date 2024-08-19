const { Member, Book, Borrow } = require("../models");
const { Op } = require("sequelize");

class BooksController {
  static async getAllBooks(req, res, next) {
    try {
      res.status(200).json();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = BooksController;

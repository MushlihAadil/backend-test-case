const { Member, Book, Borrow } = require("../models");
const { Op } = require("sequelize");

class BooksController {
  /**
   * @swagger
   * /books:
   *   get:
   *     summary: Get all books
   *     tags: [Books API]
   *     responses:
   *       200:
   *         description: Get list of all books including the stock
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *       500:
   *         description: Internal server error
   */
  static async getAllBooks(req, res, next) {
    try {
      const books = await Book.findAll({
        include: [
            {
                model: Borrow,
                where: { returnDate: null },
                required: false
            }
        ]
      });

      const booksAvailable = books.map((book) => ({
        ...book.toJSON(),
        stock: book.stock - book.Borrows.length,
      }));

      res.status(200).json(booksAvailable);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = BooksController;

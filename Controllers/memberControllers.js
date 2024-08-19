const { Member, Book, Borrow } = require("../models");
const { Op, where } = require("sequelize");

class MemberController {
  /**
   * @swagger
   * /members:
   *   get:
   *     summary: Get all members
   *     tags: [Members API]
   *     responses:
   *       200:
   *         description: List of all members
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *       500:
   *         description: Internal server error
   */

  static async getAllMembers(req, res, next) {
    try {
      const members = await Member.findAll();

      res.status(200).json(members);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /members/{id}:
   *   get:
   *     summary: Get member details
   *     tags: [Members API]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Member ID
   *     responses:
   *       200:
   *         description: Member details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 member:
   *                   href: '#/components/schemas/Member'
   *                 booksBorrow:
   *                   type: array
   *                   items:
   *                     href: '#/components/schemas/Book'
   *                 booksCount:
   *                   type: integer
   *       404:
   *         description: Member is not found
   *       500:
   *         description: Internal server error
   */

  static async getMemberDetails(req, res, next) {
    const memberId = req.params.id;

    try {
      const member = await Member.findByPk(memberId, {
        include: [
          {
            model: Borrow,
            include: [Book],
          },
        ],
      });

      if (!member) throw { name: "MemberNotFound" };

      const booksBorrow = member.Borrows.filter(
        (borrow) => !borrow.returnDate
      ).map((borrow) => borrow.Book);

      res.status(200).json({
        member,
        booksBorrow,
        booksCount: booksBorrow.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /members/{id}/borrow:
   *   post:
   *     summary: A member borrowing books
   *     tags: [Members API]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Member ID
   *       - in: body
   *         name: bookId
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 bookId:
   *                   type: integer
   *                   description: Book ID
   *     responses:
   *       200:
   *         description: You successfully borrow {book title}
   *       400:
   *         description: Member not found, Penalized member, Maximum borrowing limit and Book are not available
   *       500:
   *         description: Internal server error
   */

  static async memberBorrowBook(req, res, next) {
    const memberId = req.params.id;
    const { bookId } = req.body;

    try {
      const member = await Member.findByPk(memberId, {
        include: [
          {
            model: Borrow,
            include: [Book],
          },
        ],
      });

      if (!member) throw { name: "MemberNotFound" };
      if (member.isPenalized == true) throw { name: "PenalizedMember" };
      const borrowedBooks = await Borrow.count({
        where: {
          memberId: memberId,
          returnDate: null,
        },
      });

      if (borrowedBooks >= 2) throw { name: "MaximumLimit" };
      const alreadyBorrowed = await Borrow.findOne({
        where: {
          bookId: bookId,
          returnDate: null,
        },
      });

      if (alreadyBorrowed) throw { name: "NotAvailable" };

      await Borrow.create({
        memberId: memberId,
        bookId: bookId,
        borrowDate: new Date(),
      });

      const borrowSuccess = await Book.findByPk(bookId);

      res
        .status(200)
        .json({ message: `You successfully borrow ${borrowSuccess.title}` });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /members/{id}/return:
   *   post:
   *     summary: A member returning books
   *     tags: [Members API]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Member ID
   *       - in: body
   *         name: bookId
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 bookId:
   *                   type: integer
   *                   description: Book ID
   *     responses:
   *       200:
   *         description: You successfully return a book
   *       400:
   *         description: Member not borrowing the book
   *       500:
   *         description: Internal server error
   */

  static async memberReturnBook(req, res, next) {
    const memberId = req.params.id;
    const { bookId } = req.body;

    try {
      const borrow = await Borrow.findOne({
        where: {
          memberId: memberId,
          bookId: bookId,
          returnDate: null,
        },
      });

      if (!borrow) throw { name: "NotBorrowed" };

      const borrowDate = new Date(borrow.borrowDate);
      const returnDate = new Date();
      const timeDifferent = Math.abs(returnDate - borrowDate);
      const daysDifferent = Math.ceil(timeDifferent / (1000 * 60 * 60 * 24));

      if (daysDifferent > 7) {
        await Member.update(
          { isPenalized: true },
          { where: { memberId: memberId } }
        );
      }

      borrow.returnDate = returnDate;
      await Borrow.save();

      res.status(200).json({ message: `You successfully return a book` });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MemberController;

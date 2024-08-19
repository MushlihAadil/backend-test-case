const { Member, Book, Borrow } = require("../models");
const { Op, where } = require("sequelize");

class MemberController {
  static async getAllMembers(req, res, next) {
    try {
      res.status(200).json();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = MemberController;

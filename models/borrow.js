"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Borrow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Borrow.belongsTo(models.Member, {
        foreignKey: "memberId",
      });
      Borrow.belongsTo(models.Book, {
        foreignKey: "bookId",
      });
    }
  }
  Borrow.init(
    {
      memberId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Members",
          key: "id",
        },
        validate: {
          notNull: { args: true, msg: "MemberId is required" },
          notEmpty: { args: true,msg: "MemberId is required" },
        },
      },
      bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Books",
          key: "id",
        },
        validate: {
          notNull: { args: true, msg: "BookId is required" },
          notEmpty: { args: true,msg: "BookId is required" },
          isBorrowed(value) {
            Borrow.findOne({
              where: {
                bookId: value,
                returnDate: null
              }
            }).then((borrow) => {
              if (borrow) {
                throw new Error("Book is still borrowed, look for another book")
              }
            })
          }
        },
      },
      borrowDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      returnDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Borrow",
    }
  );
  return Borrow;
};

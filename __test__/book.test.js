const request = require("supertest");
const express = require("express");
const app = require("../app");
const { Book, Borrow } = require("../models");

beforeAll(async () => {
  try {
    //Seed Books
    let books = require("../data/books.json").map((item) => {
      delete item.id;
      item.createdAt = item.updatedAt = new Date();
      return item;
    });
    await Book.bulkCreate(books);
  } catch (error) {
    console.log(error, "<======= error seeding testing");
  }
});

// TESTING NIH
describe("GET/books", () => {
  describe("Success get all books", () => {
    test("Status 200", async () => {
      const books = await Book.findAll({
        include: [
          {
            model: Borrow,
            where: { returnDate: null },
            required: false,
          },
        ],
      });

      const response = await request(app).get("/books").send(books);
      const { body, status } = response;

      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
    });
  });
});

afterAll(async () => {
  try {
    await Book.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    await Borrow.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  } catch (error) {
    console.log(error, "<======= hapus seeding");
  }
});

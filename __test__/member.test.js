const request = require("supertest");
const express = require("express");
const app = require("../app");
const { Member, Book, Borrow } = require("../models");

beforeAll(async () => {
  try {
    //Seed Members
    let members = require("../data/members.json").map((item) => {
      delete item.id;
      item.createdAt = item.updatedAt = new Date();
      return item;
    });
    await Member.bulkCreate(members);

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

describe("Testing Member Entitiy", () => {
  describe("GET/members", () => {
    describe("Success get all members", () => {
      test("Status 200", async () => {
        const members = await Member.findAll();

        const response = await request(app).get("/members").send(members);
        const { body, status } = response;

        expect(status).toBe(200);
        expect(body).toBeInstanceOf(Object);
      });
    });
  });

  describe("GET/members/:id", () => {
    describe("Success member by Id", () => {
      test("Status 200", async () => {
        const { memberId } = 1;
        const member = await Member.findByPk(memberId, {
          include: [
            {
              model: Borrow,
              include: [Book],
            },
          ],
        });

        const response = await request(app).get("/members/1").send(member);
        const { body, status } = response;

        expect(status).toBe(200);
        expect(body).toBeInstanceOf(Object);
        expect(body.member).toHaveProperty("id", expect.any(Number));
        expect(body.member).toHaveProperty("code", expect.any(String));
        expect(body.member).toHaveProperty("name", expect.any(String));
        expect(body.member).toHaveProperty("isPenalized", expect.any(Boolean));
        expect(body.member).toHaveProperty("createdAt", expect.any(String));
        expect(body.member).toHaveProperty("updatedAt", expect.any(String));
      });
    });

    describe("Failed member by Id", () => {
      test("Status 404", async () => {
        const { memberId } = 100;
        const member = await Member.findByPk(memberId, {
          include: [
            {
              model: Borrow,
              include: [Book],
            },
          ],
        });

        const response = await request(app).get("/members/100").send(member);
        const { body, status } = response;

        expect(status).toBe(404);
        expect(body).toBeInstanceOf(Object);
        expect(body).toHaveProperty("message", "Member is not found");
      });
    });
  });
});

afterAll(async () => {
  try {
    await Member.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

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

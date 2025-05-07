// tests/books.test.js

process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../config/db");

let testBook;

beforeEach(async () => {
  const result = await db.query(`
    INSERT INTO books
      (isbn, amazon_url, author, language, pages, publisher, title, year, genres, reviews)
    VALUES
      ('1234567890', 'http://a.co/test', 'Test Author', 'english', 123, 'Test Publisher', 'Test Title', 2020, $1, $2)
    RETURNING *`,
  [['Fantasy'], JSON.stringify([])]
);

  testBook = result.rows[0];
});

afterEach(async () => {
  await db.query("DELETE FROM books");
});

afterAll(async () => {
  await db.end();
});

describe("GET /books", () => {
  test("Gets a list of books", async () => {
    const res = await request(app).get("/books");
    expect(res.statusCode).toBe(200);
    expect(res.body.books).toHaveLength(1);
    expect(res.body.books[0]).toHaveProperty("isbn");
  });
});

describe("POST /books", () => {
  test("Creates a new book", async () => {
    const res = await request(app).post("/books")
    .send({
      isbn: "1111111111",
      amazon_url: "http://a.co/test2",
      author: "Another Author",
      language: "english",
      pages: 321,
      publisher: "Another Publisher",
      title: "Another Title",
      year: 2021,
      genres: [],
      reviews: []
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.book).toHaveProperty("isbn");
  });
});
describe("PATCH /books/:isbn", () => {
  test("Updates a book's title and pages", async () => {
    const res = await request(app)
      .patch(`/books/${testBook.isbn}`)
      .send({
        title: "Updated Test Book",
        pages: 999
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.book.title).toBe("Updated Test Book");
    expect(res.body.book.pages).toBe(999);
  });

  test("Returns 404 for invalid isbn", async () => {
    const res = await request(app)
      .patch("/books/nonexistent")
      .send({ title: "Doesn't matter" });

    expect(res.statusCode).toBe(404);
  });
});
test("Rejects book with multiple issues", async () => {
  const res = await request(app).post("/books").send({
    pages: "not-a-number",
    year: "not-a-number"
  });

  expect(res.statusCode).toBe(400);
  expect(res.body.errors).toContain("Missing required field: isbn");
  expect(res.body.errors).toContain("Missing required field: amazon_url");
  expect(res.body.errors).toContain("Pages must be a number");
  expect(res.body.errors).toContain("Year must be a number");
});
test("Rejects book with invalid genres", async () => {
  const res = await request(app).post("/books").send({
    isbn: "1234567890",
    amazon_url: "http://a.co/test",
    author: "Test Author",
    language: "English",
    pages: 123,
    publisher: "Test Publisher",
    title: "Test Book",
    year: 2022,
    genres: [123, "", "Fiction"]
  });

  expect(res.statusCode).toBe(400);
  expect(res.body.errors).toContain("Genres array must only contain non-empty strings");
});

test("Rejects book when genres is not an array", async () => {
  const res = await request(app).post("/books")
  .send({
    isbn: "1234567891",
    amazon_url: "http://a.co/test2",
    author: "Another Author",
    language: "English",
    pages: 321,
    publisher: "Test Publisher",
    title: "Another Test",
    year: 2021,
    genres: [],
    reviews: []
  });

  expect(res.statusCode).toBe(400);
  expect(res.body.errors).toContain("Genres must be an array");
});

test("Accepts book with valid genres", async () => {
  const res = await request(app).post("/books").send({
    isbn: "1234567892",
    amazon_url: "http://a.co/test3",
    author: "Valid Author",
    language: "English",
    pages: 222,
    publisher: "Valid Publisher",
    title: "Valid Book",
    year: 2024,
    genres: ["Sci-Fi", "Adventure"]
  });

  expect(res.statusCode).toBe(201);
  expect(res.body.book.genres).toEqual(["Sci-Fi", "Adventure"]);
});


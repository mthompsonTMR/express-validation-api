const validateBook = require("../utils/validateBook");
const express = require("express");
const Book = require("../models/book");
const router = express.Router();

/** GET /books => list all books */
router.get("/", async (req, res, next) => {
  try {
    const books = await Book.findAll();
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /books/:isbn => get single book by isbn */
router.get("/:isbn", async (req, res, next) => {
  try {
    const book = await Book.get(req.params.isbn);
    if (!book) return res.status(404).json({ error: "Book not found" });
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /books => create a new book */
router.post("/", async (req, res, next) => {
  try {
    const errors = validateBook(req.body, false); // Full validation
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const {
      isbn,
      amazon_url,
      author,
      language,
      pages,
      publisher,
      title,
      year,
      genres,
      reviews
    } = req.body;

//error check
    console.log("creating book with data:", req.body);
    
    const newBook = await Book.create({
      isbn,
      amazon_url,
      author,
      language,
      pages,
      publisher,
      title,
      year,
      genres,
      reviews
    });

    return res.status(201).json({ book: newBook });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /books/:isbn => partial update of a book */
router.patch("/:isbn", async (req, res, next) => {
  try {
    const errors = validateBook(req.body, true); // Partial validation
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const book = await Book.update(req.params.isbn, req.body);
    if (!book) return res.status(404).json({ error: "Book not found" });
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /books/:isbn => remove a book */
router.delete("/:isbn", async (req, res, next) => {
  try {
    await Book.delete(req.params.isbn);
    return res.json({ message: "Deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

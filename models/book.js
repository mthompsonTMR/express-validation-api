// models/book.js

const db = require("../config/db");

class Book {
  static async findAll() {
    const result = await db.query(`
      SELECT id, isbn, amazon_url, author, language, pages, publisher, title, year FROM books
    `);
    return result.rows;
  }
  
  static async create(input) { 
    const {isbn, amazon_url, author, language, pages, publisher, title, year, genres = [], reviews = [] 
  } = input;
    
      const result = await db.query(
      `INSERT INTO books 
        (isbn, amazon_url, author, language, pages, publisher, title, year, genres, reviews)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, isbn, amazon_url, author, language, pages, publisher, title, year, genres, reviews`,
      [isbn, amazon_url, author, language, pages, publisher, title, year, genres, JSON.stringify(reviews)]
    );
    return result.rows[0];
  }
  static async update(isbn, data) {
    // Get keys of fields to update
    const keys = Object.keys(data);
    if (keys.length === 0) throw new Error("No data to update");
  
    // Create SQL SET clause dynamically
    const cols = keys.map((col, idx) => `${col} = $${idx + 1}`).join(", ");
  
    const result = await db.query(
      `UPDATE books SET ${cols} WHERE isbn = $${keys.length + 1} RETURNING *`,
      [...keys.map(k => data[k]), isbn]
    );
  
    const book = result.rows[0];
    return book;
  }
  

  static async get(id) {
    const result = await db.query(
      `SELECT id, title, author FROM books WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await db.query(`DELETE FROM books WHERE id = $1`, [id]);
  }
}

module.exports = Book;

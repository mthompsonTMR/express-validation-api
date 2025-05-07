// config/config.js
let DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = "postgresql:///books_test";
} else {
  DB_URI = process.env.DATABASE_URL || "postgresql:///books";
}

module.exports = { DB_URI };

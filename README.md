# 📚 Express Validation API

An Express.js REST API that manages a collection of books with robust manual input validation. Built with PostgreSQL and tested using Jest and Supertest.

---

## 🚀 Features

- Full CRUD for books (`GET`, `POST`, `PATCH`, `DELETE`)
- Manual input validation (required fields, data types)
- Supports advanced fields like `genres` (array) and `reviews` (JSONB)
- Jest test suite for error handling and edge cases
- Modular structure using MVC pattern

---

## 🛠️ Technologies Used

- **Node.js** / **Express**
- **PostgreSQL**
- **Jest** + **Supertest** for testing
- **pg** for DB client
- Manual validation logic (no external libraries)

---

## 📦 Setup Instructions

1. **Clone the repo**

```bash
git clone git@github.com:mthompsonTMR/express-validation-api.git
cd express-validation-api

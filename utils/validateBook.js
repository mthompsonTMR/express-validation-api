function validateBook(data, isPatch = false) {
  const errors = [];
  const requiredFields = [
    "isbn", "amazon_url", "author", "language", "pages",
    "publisher", "title", "year"
  ];

  // For POST requests (not isPatch), ensure all required fields are present
  if (!isPatch) {
    for (let field of requiredFields) {
      if (data[field] === undefined || data[field] === "") {
        errors.push(`Missing required field: ${field}`);
      }
    }
  }

  // Type checks
  if (data.pages !== undefined && typeof data.pages !== "number") {
    errors.push("Pages must be a number");
  }

  if (data.year !== undefined && typeof data.year !== "number") {
    errors.push("Year must be a number");
  }

  // Genres validation
  if (data.genres !== undefined) {
    if (!Array.isArray(data.genres)) {
      errors.push("Genres must be an array");
    } else {
      const invalid = data.genres.some(
        g => typeof g !== "string" || g.trim() === ""
      );
      if (invalid) {
        errors.push("Genres array must only contain non-empty strings");
      }
      
    }
  }

  return errors; // Always return an array (even empty)
}

module.exports = validateBook;

const db = require('../config/db');

exports.getAll = async () => {
  const result = await db.query(
    `SELECT id, name 
     FROM categories`
  );

  return result.rows;
};
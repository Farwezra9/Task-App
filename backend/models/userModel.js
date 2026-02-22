const db = require('../config/db');

const baseSelect = 'SELECT id, name, email, role, status FROM users';

exports.create = async (data) => {
  const { name, email, password, role, status } = data;
  const result = await db.query(
    `INSERT INTO users (name, email, password, role, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, role, status`,
    [name, email, password, role, status]
  );
  return result.rows[0];
};

exports.findByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

exports.getAll = async () => {
  const result = await db.query(baseSelect);
  return result.rows;
};

exports.getById = async (id) => {
  const result = await db.query(
    `${baseSelect} WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

exports.update = async (id, data) => {
  const { name, email, role, status } = data;

  const result = await db.query(
    `UPDATE users 
     SET name = $1, email = $2, role = $3, status = $4
     WHERE id = $5
     RETURNING id, name, email, role, status`,
    [name, email, role, status, id]
  );

  return result.rows[0];
};

exports.delete = async (id) => {
  await db.query('DELETE FROM users WHERE id = $1', [id]);
  return { message: 'User deleted' };
};

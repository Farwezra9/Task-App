const db = require('../config/db');

const baseSelect = `
  SELECT 
    id, 
    title, 
    description, 
    is_completed, 
    due_date, 
    created_at,
    completed_at
  FROM todos
`;

exports.create = async (userId, data) => {
  const { title, description, due_date, category_id } = data;

  const result = await db.query(
    `INSERT INTO todos 
      (title, description, due_date, user_id, category_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, title, description, is_completed, due_date, created_at, completed_at`,
    [title, description || null, due_date || null, userId, category_id || null]
  );

  return result.rows[0];
};

exports.getAll = async (userId) => {
  const result = await db.query(
    `${baseSelect} 
     WHERE user_id = $1 
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
};

exports.getById = async (id, userId) => {
  const result = await db.query(
    `${baseSelect} 
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );

  return result.rows[0];
};

exports.update = async (id, userId, data) => {
  const { title, description, is_completed, due_date, category_id } = data;

  const result = await db.query(
    `UPDATE todos
     SET 
       title = $1,
       description = $2,
       is_completed = $3,
       due_date = $4,
       category_id = $5,
       completed_at = CASE 
         WHEN $3 = true THEN NOW()
         WHEN $3 = false THEN NULL
         ELSE completed_at
       END
     WHERE id = $6 AND user_id = $7
     RETURNING id, title, description, is_completed, due_date, created_at, completed_at`,
    [
      title,
      description || null,
      is_completed,
      due_date || null,
      category_id || null,
      id,
      userId
    ]
  );

  return result.rows[0];
};

exports.delete = async (id, userId) => {
  const result = await db.query(
    `DELETE FROM todos 
     WHERE id = $1 AND user_id = $2 
     RETURNING id`,
    [id, userId]
  );

  return result.rowCount > 0;
};
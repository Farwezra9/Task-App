const db = require('../config/db');

const baseSelect = `
  SELECT 
    t.id, 
    t.title, 
    t.description, 
    t.category_id,
    c.name AS category_name,
    t.is_completed, 
    t.due_date, 
    t.created_at,
    t.completed_at
  FROM todos t
  LEFT JOIN categories c ON t.category_id = c.id
`;

exports.create = async (userId, data) => {
  const { title, description, due_date, category_id } = data;

  const result = await db.query(
    `
    INSERT INTO todos 
      (title, description, category_id, due_date, user_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
    `,
    [
      title,
      description || null,
      category_id || null,
      due_date || null,
      userId
    ]
  );

  const todoId = result.rows[0].id;

  const joined = await db.query(
    `${baseSelect} WHERE t.id = $1`,
    [todoId]
  );

  return joined.rows[0];
};

exports.getAll = async (userId) => {
  const result = await db.query(
    `
    ${baseSelect}
    WHERE t.user_id = $1
    ORDER BY t.created_at DESC
    `,
    [userId]
  );

  return result.rows;
};
exports.getById = async (id, userId) => {
  const result = await db.query(
    `
    ${baseSelect}
    WHERE t.id = $1 AND t.user_id = $2
    `,
    [id, userId]
  );

  return result.rows[0];
};

exports.update = async (id, userId, data) => {
  const { title, description, category_id, is_completed, due_date } = data;

  await db.query(
    `
    UPDATE todos
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
    `,
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

  const updated = await db.query(
    `
    ${baseSelect}
    WHERE t.id = $1 AND t.user_id = $2
    `,
    [id, userId]
  );

  return updated.rows[0];
};

exports.delete = async (id, userId) => {
  const result = await db.query(
    `
    DELETE FROM todos 
    WHERE id = $1 AND user_id = $2 
    RETURNING id
    `,
    [id, userId]
  );

  return result.rowCount > 0;
};
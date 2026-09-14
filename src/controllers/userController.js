const pool = require("../config/db");

function validateUserInput(body, partial = false) {
  const errors = [];
  const { name, email } = body;

  if (!partial || name !== undefined) {
    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      name.trim().length > 100
    ) {
      errors.push("name must be between 2 and 100 characters");
    }
  }

  if (!partial || email !== undefined) {
    if (
      typeof email !== "string" ||
      !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.trim())
    ) {
      errors.push("email must be a valid email address");
    }
  }

  return errors;
}

async function listUsers(req, res, next) {
  try {
    const [rows] = await pool.execute(
      "SELECT id, name, email, created_at, updated_at FROM users ORDER BY id DESC",
    );
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
}

async function getUser(req, res, next) {
  try {
    const [rows] = await pool.execute(
      "SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?",
      [req.params.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(rows[0]);
  } catch (error) {
    return next(error);
  }
}

async function createUser(req, res, next) {
  const errors = validateUserInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const name = req.body.name.trim();
    const email = req.body.email.trim().toLowerCase();
    const [result] = await pool.execute(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email],
    );
    const [rows] = await pool.execute(
      "SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?",
      [result.insertId],
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    return next(error);
  }
}

async function updateUser(req, res, next) {
  const errors = validateUserInput(req.body, true);
  if (errors.length > 0 || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      errors: errors.length > 0 ? errors : ["Provide name or email to update"],
    });
  }

  try {
    const fields = [];
    const values = [];

    if (req.body.name !== undefined) {
      fields.push("name = ?");
      values.push(req.body.name.trim());
    }
    if (req.body.email !== undefined) {
      fields.push("email = ?");
      values.push(req.body.email.trim().toLowerCase());
    }

    values.push(req.params.id);
    const [result] = await pool.execute(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const [rows] = await pool.execute(
      "SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?",
      [req.params.id],
    );
    return res.json(rows[0]);
  } catch (error) {
    return next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};

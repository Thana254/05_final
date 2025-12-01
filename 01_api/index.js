const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config({ path: '.env.local' });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dit312_final',
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ---------------------------------------
// Health Check
// ---------------------------------------
app.get('/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ status: 'ok', db: rows[0].ok === 1 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// ---------------------------------------
// GET all todos
// ---------------------------------------
app.get('/todos', async (req, res) => {
  try {
    // เปลี่ยน DESC → ASC
    const [rows] = await pool.query('SELECT * FROM todos ORDER BY id ASC');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ---------------------------------------
// ADD todo
// ---------------------------------------
app.post('/todos', async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    const [result] = await pool.query(
      'INSERT INTO todos (title, description, status, deadline) VALUES (?, ?, ?, ?)',
      [title, description || null, 'pending', deadline || null] // status เป็น pending
    );

    res.json({
      id: result.insertId,
      title,
      description: description || null,
      status: 'pending',
      deadline: deadline || null
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ---------------------------------------
// UPDATE todo
// ---------------------------------------
app.put('/todos/:id', async (req, res) => {
  try {
    const { title, description, status, deadline } = req.body;
    const { id } = req.params;

    const [result] = await pool.query(
      'UPDATE todos SET title=?, description=?, status=?, deadline=? WHERE id=?',
      [title, description || null, status, deadline || null, id]
    );

    // [เพิ่ม] เช็คว่ามีการแก้ไขจริงไหม
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'updated', id, title, description, status, deadline });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ---------------------------------------
// DELETE todo
// ---------------------------------------
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM todos WHERE id=?', [id]);

    // [เพิ่ม] เช็คว่าลบจริงไหม (เผื่อ ID ผิด)
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'deleted', id });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ---------------------------------------

const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));

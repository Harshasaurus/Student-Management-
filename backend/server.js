require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Student = require('./models/Student');

const app = express();
const port = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5500,http://127.0.0.1:5500')
  .split(',').map((origin) => origin.trim()).filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Student API is running' });
});

function validateStudent(body) {
  const required = ['studentId', 'name', 'email', 'department', 'semester'];
  const missing = required.filter((field) => body[field] === undefined || body[field] === '');
  if (missing.length) return `Missing required fields: ${missing.join(', ')}`;
  if (!/^\S+@\S+\.\S+$/.test(body.email)) return 'A valid email is required';
  if (!Number.isInteger(Number(body.semester)) || Number(body.semester) < 1 || Number(body.semester) > 12) {
    return 'Semester must be an integer from 1 to 12';
  }
  return null;
}

app.get('/api/students', async (_req, res, next) => {
  try { res.json({ success: true, data: await Student.find().sort({ studentId: 1 }) }); }
  catch (error) { next(error); }
});

app.get('/api/students/:id', async (req, res, next) => {
  try {
    const student = await Student.findOne({ studentId: req.params.id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (error) { next(error); }
});

app.post('/api/students', async (req, res, next) => {
  try {
    const validationError = validateStudent(req.body);
    if (validationError) return res.status(400).json({ success: false, message: validationError });
    const student = await Student.create(req.body);
    res.status(201).json({ success: true, message: 'Student added successfully', data: student });
  } catch (error) { next(error); }
});

app.put('/api/students/:id', async (req, res, next) => {
  try {
    const validationError = validateStudent({ ...req.body, studentId: req.params.id });
    if (validationError) return res.status(400).json({ success: false, message: validationError });
    const student = await Student.findOneAndUpdate({ studentId: req.params.id }, req.body, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, message: 'Student updated successfully', data: student });
  } catch (error) { next(error); }
});

app.delete('/api/students/:id', async (req, res, next) => {
  try {
    const student = await Student.findOneAndDelete({ studentId: req.params.id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) { next(error); }
});

app.use((error, _req, res, _next) => {
  if (error.code === 11000) return res.status(409).json({ success: false, message: 'Student ID already exists' });
  console.error(error.message);
  res.status(500).json({ success: false, message: 'An unexpected server error occurred' });
});

function start() {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Student API listening on port ${port}`);
  });

  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI is not configured; API started without database access');
    return server;
  }

  mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection failed:', error.message));

  return server;
}

if (require.main === module) start();
module.exports = app;

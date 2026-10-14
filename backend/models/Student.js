const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    department: { type: String, required: true, trim: true },
    semester: { type: Number, required: true, min: 1, max:  semMax() },
    contact: { type: String, trim: true }
  },
  { timestamps: true }
);

function semMax() { return 12; }

module.exports = mongoose.model('Student', studentSchema);

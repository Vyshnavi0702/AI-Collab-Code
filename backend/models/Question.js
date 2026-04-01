const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy',
  },
  baseCode: {
    type: Object, // Stores starting code by language e.g., { 'javascript': 'function test() { ... }' }
    default: {},
  },
  testCases: [
    {
      input: {
        type: String,
        required: true,
      },
      expectedOutput: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model('Question', questionSchema);

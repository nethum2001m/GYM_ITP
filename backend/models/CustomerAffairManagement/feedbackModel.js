const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    instructor: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const feedbackModel = mongoose.model('Feedback', feedbackSchema);

module.exports = feedbackModel;


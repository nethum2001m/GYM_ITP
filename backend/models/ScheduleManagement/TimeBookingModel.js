const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    instructorId: {
      type: Number,
      required: true,
    },
    instructorName: {
      type: String,
      required: true,
    },
    instructorEmail: {  // Added this new field
      type: String,
      required: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },

    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeFrom: {
      type: String,  // Could also use Date if you prefer
      required: true,
    },
    timeTo: {
      type: String,  // Could also use Date if you prefer
      required: true,
    },
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'rejected', 'cancelled'], 
      default: 'pending' 
  },
},
{ timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
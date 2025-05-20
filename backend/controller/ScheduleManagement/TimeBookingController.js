const Booking = require("../../models/ScheduleManagement/TimeBookingModel");
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// Helper function to send booking confirmation email to instructor
async function sendBookingEmailToInstructor(booking, action) {
  try {
    const subject = action === 'created' 
      ? 'New Booking Request' 
      : `Booking ${action.charAt(0).toUpperCase() + action.slice(1)}`;

    const statusColor = {
      pending: '#FFA500',    // Orange
      confirmed: '#4CAF50', // Green
      rejected: '#F44336'   // Red
    };

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: booking.instructorEmail,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; }
                .header { background-color: #f5f5ff; padding: 20px; text-align: center; border-bottom: 1px solid #ddd; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .footer { padding: 15px; text-align: center; background-color: #ecf0f1; font-size: 12px; color: #7f8c8d; }
                .booking-details { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #eee; }
                .detail-row { display: flex; margin-bottom: 10px; }
                .detail-label { font-weight: bold; width: 120px; }
                .status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-weight: bold; color: white; }
                .action-button { display: inline-block; padding: 10px 20px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>REAL FITNESS CENTER</h2>
                <p>Booking Notification</p>
            </div>
            
            <div class="content">
                <p>Hello ${booking.instructorName},</p>
                
                <div class="booking-details">
                    <div class="detail-row">
                        <div class="detail-label">User:</div>
                        <div>${booking.username} (${booking.email})</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Date:</div>
                        <div>${new Date(booking.date).toLocaleDateString()}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Time:</div>
                        <div>${booking.timeFrom} - ${booking.timeTo}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Status:</div>
                        <div class="status-badge" style="background-color: ${statusColor[booking.status]}">
                            ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </div>
                    </div>
                    ${action === 'rejected' && booking.rejectionReason ? `
                    <div class="detail-row">
                        <div class="detail-label">Reason:</div>
                        <div>${booking.rejectionReason}</div>
                    </div>
                    ` : ''}
                </div>
                
                <p>${action === 'created' 
                  ? 'Please log in to your account to confirm or reject this booking request.' 
                  : `This booking has been ${action}.`}
                </p>
            </div>
            
            <div class="footer">
                <p>© ${new Date().getFullYear()} Real Fitness Center</p>
            </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email to instructor:', error);
    return false;
  }
}

// Send confirmation email to user
async function sendConfirmationEmailToUser(booking) {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: booking.email,
      subject: `Your Booking with ${booking.instructorName} is Confirmed`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; }
                .header { background-color: #f5f5ff; padding: 20px; text-align: center; border-bottom: 1px solid #ddd; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .footer { padding: 15px; text-align: center; background-color: #ecf0f1; font-size: 12px; color: #7f8c8d; }
                .booking-details { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #eee; }
                .detail-row { display: flex; margin-bottom: 10px; }
                .detail-label { font-weight: bold; width: 120px; }
                .status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-weight: bold; color: white; background-color: #4CAF50; }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>REAL FITNESS CENTER</h2>
                <p>Booking Confirmation</p>
            </div>
            
            <div class="content">
                <p>Hello ${booking.username},</p>
                
                <p>Your booking with ${booking.instructorName} has been confirmed!</p>
                
                <div class="booking-details">
                    <div class="detail-row">
                        <div class="detail-label">Instructor:</div>
                        <div>${booking.instructorName}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Date:</div>
                        <div>${new Date(booking.date).toLocaleDateString()}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Time:</div>
                        <div>${booking.timeFrom} - ${booking.timeTo}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Status:</div>
                        <div class="status-badge">Confirmed</div>
                    </div>
                </div>
                
                <p>Please arrive 10 minutes before your scheduled time.</p>
            </div>
            
            <div class="footer">
                <p>© ${new Date().getFullYear()} Real Fitness Center</p>
            </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending confirmation email to user:', error);
    return false;
  }
}

// Send rejection email to user
async function sendRejectionEmailToUser(booking, reason) {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: booking.email,
      subject: `Your Booking with ${booking.instructorName} has been Rejected`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; }
                .header { background-color: #f5f5ff; padding: 20px; text-align: center; border-bottom: 1px solid #ddd; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .footer { padding: 15px; text-align: center; background-color: #ecf0f1; font-size: 12px; color: #7f8c8d; }
                .booking-details { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #eee; }
                .detail-row { display: flex; margin-bottom: 10px; }
                .detail-label { font-weight: bold; width: 120px; }
                .status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-weight: bold; color: white; background-color: #F44336; }
                .reason-box { background-color: #ffebee; padding: 10px; margin: 10px 0; border-left: 4px solid #F44336; }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>REAL FITNESS CENTER</h2>
                <p>Booking Rejection</p>
            </div>
            
            <div class="content">
                <p>Hello ${booking.username},</p>
                
                <p>We regret to inform you that your booking with ${booking.instructorName} has been rejected.</p>
                
                <div class="booking-details">
                    <div class="detail-row">
                        <div class="detail-label">Instructor:</div>
                        <div>${booking.instructorName}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Date:</div>
                        <div>${new Date(booking.date).toLocaleDateString()}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Time:</div>
                        <div>${booking.timeFrom} - ${booking.timeTo}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Status:</div>
                        <div class="status-badge">Rejected</div>
                    </div>
                </div>
                
                <div class="reason-box">
                    <h3>Reason for Rejection:</h3>
                    <p>${reason}</p>
                </div>
                
                <p>You may want to try booking another time slot or with another instructor.</p>
            </div>
            
            <div class="footer">
                <p>© ${new Date().getFullYear()} Real Fitness Center</p>
            </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending rejection email to user:', error);
    return false;
  }
}

// Send cancellation email to instructor
async function sendCancellationEmailToInstructor(booking, reason, userName, userEmail) {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: booking.instructorEmail,
      subject: 'Booking Cancellation Notification',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; }
                .header { background-color: #f5f5ff; padding: 20px; text-align: center; border-bottom: 1px solid #ddd; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .footer { padding: 15px; text-align: center; background-color: #ecf0f1; font-size: 12px; color: #7f8c8d; }
                .booking-details { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #eee; }
                .detail-row { display: flex; margin-bottom: 10px; }
                .detail-label { font-weight: bold; width: 120px; }
                .reason-box { background-color: #fff3e0; padding: 10px; margin: 10px 0; border-left: 4px solid #FFA726; }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>REAL FITNESS CENTER</h2>
                <p>Booking Cancellation</p>
            </div>
            
            <div class="content">
                <p>Hello ${booking.instructorName},</p>
                
                <p>The following booking has been cancelled by ${userName} (${userEmail}):</p>
                
                <div class="booking-details">
                    <div class="detail-row">
                        <div class="detail-label">Date:</div>
                        <div>${new Date(booking.date).toLocaleDateString()}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Time:</div>
                        <div>${booking.timeFrom} - ${booking.timeTo}</div>
                    </div>
                </div>
                
                <div class="reason-box">
                    <h3>Cancellation Reason:</h3>
                    <p>${reason}</p>
                </div>
                
                <p>Please log in to your dashboard to manage your schedule.</p>
            </div>
            
            <div class="footer">
                <p>© ${new Date().getFullYear()} Real Fitness Center</p>
            </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending cancellation email:', error);
    return false;
  }
}

// Create new booking
async function createBooking(req, res) {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();

    // Send notification to instructor
    await sendBookingEmailToInstructor(newBooking, 'created');

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: newBooking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: true
    });
  }
}

// Update booking status (confirm/reject)
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status, rejectionReason } = req.body;

    if (!bookingId || !status) {
      return res.status(400).json({
        success: false,
        message: "Booking ID and status are required"
      });
    }

    const validStatuses = ['pending', 'confirmed', 'rejected', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    if (status === 'rejected' && !rejectionReason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required"
      });
    }

    const updateData = { status };
    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Send appropriate notifications
    if (status === 'confirmed') {
      await sendConfirmationEmailToUser(updatedBooking);
      //await sendBookingEmailToInstructor(updatedBooking, 'confirmed');
    } else if (status === 'rejected') {
      await sendRejectionEmailToUser(updatedBooking, rejectionReason);
      //await sendBookingEmailToInstructor(updatedBooking, 'rejected');
    }

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      data: updatedBooking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: true
    });
  }
};

// Get booking by ID
async function getBookingById(req, res) {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: true
    });
  }
}

// Get user's bookings by email
async function getUserBookingsByMail(req, res) {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Email not found in token"
      });
    }

    const bookings = await Booking.find({ email: userEmail });
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: true
    });
  }
}

// Get all bookings
async function getAllBookings(req, res) {
  try {
    const bookings = await Booking.find();
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: true
    });
  }
}

// Get bookings by instructor
async function getBookingsByInstructor(req, res) {
  try {
    const instructorId = req.params.instructorId;
    const bookings = await Booking.find({ instructorId });
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: true
    });
  }
}

// Update booking details
async function updateBooking(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: updatedBooking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: true
    });
  }
}

// Delete (cancel) booking
async function deleteBooking(req, res) {
  try {
    const { id } = req.params;
    const { reason, userEmail, userName } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Cancellation reason is required"
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Update status to cancelled instead of deleting
    booking.status = 'cancelled';
    booking.cancellationReason = reason;
    booking.cancelledBy = userEmail;
    await booking.save();

    // Send cancellation email
    await sendCancellationEmailToInstructor(booking, reason, userName, userEmail);

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: true
    });
  }
}

module.exports = {
  createBooking,
  getBookingById,
  getUserBookingsByMail,
  getAllBookings,
  getBookingsByInstructor,
  updateBooking,
  deleteBooking,
  updateBookingStatus
};
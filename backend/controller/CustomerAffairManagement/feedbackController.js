const feedbackModel = require("../../models/CustomerAffairManagement/feedbackModel");

// Create Feedback
async function createFeedback(req, res) {
    try {
        const newFeedback = new feedbackModel(req.body);
        await newFeedback.save();
        res.status(201).json({ data: newFeedback, success: true, message: "Feedback submitted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message || err, error: true, success: false });
    }
}

// Get Feedback by ID
async function getFeedbackById(req, res) {
    try {
        const feedback = await feedbackModel.findById(req.params.id);
        res.status(feedback ? 200 : 404).json(feedback ? { data: feedback, success: true } : { message: "Feedback not found", error: true });
    } catch (err) {
        res.status(400).json({ message: err.message || err, error: true, success: false });
    }
}

//get userfeedback
async function getUserFeedbackByMail(req, res) {
    try {
        const userEmail = req.user?.email;
        if (!userEmail) {
            return res.status(401).json({ success: false, message: "Unauthorized: Email not found in token" });
        }

        const feedbacks = await feedbackModel.find({ email: userEmail });
        res.status(200).json({ data: feedbacks, success: true, message: "Feedbacks retrieved successfully" });

    } catch (err) {
        res.status(400).json({ message: err.message || err, error: true, success: false });
    }
}


//

// Get All Feedbacks
async function getAllFeedback(req, res) {
    try {
        const feedbacks = await feedbackModel.find();
        res.status(200).json({ data: feedbacks, success: true, message: "All feedbacks retrieved successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message || err, error: true, success: false });
    }
}

// Update Feedback
const updateFeedback = async (req, res) => {
    try {
        const updatedFeedback = await feedbackModel.findByIdAndUpdate(
            req.body._id,           // ID to find
            req.body,              // Data to update
            { 
                new: true,         // Return the updated document
                runValidators: true // Ensure model validations are applied
            }
        );

        if (!updatedFeedback) {
            return res.status(404).json({ 
                success: false,
                message: "Feedback not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedFeedback,
            message: "Feedback updated successfully"
        });
    } catch (error) {
        console.error("Error updating feedback:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update feedback",
            error: error.message
        });
    }
};

// Delete Feedback
async function deleteFeedback(req, res) {
    try {
        const deletedFeedback = await feedbackModel.findByIdAndDelete(req.params.id);
        res.status(deletedFeedback ? 200 : 404).json(deletedFeedback ? { data: deletedFeedback, success: true } : { message: "Feedback not found", error: true });
    } catch (err) {
        res.status(400).json({ message: err.message || err, error: true, success: false });
    }
}


  


module.exports = { createFeedback, getFeedbackById, getAllFeedback,updateFeedback ,deleteFeedback , getUserFeedbackByMail};
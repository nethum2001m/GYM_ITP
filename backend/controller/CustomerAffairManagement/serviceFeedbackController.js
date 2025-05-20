// serviceFeedbackController.js
const serviceFeedbackModel = require("../../models/CustomerAffairManagement/serviceFeedbackModel");

// Create Service Feedback
async function createServiceFeedback(req, res) {
    try {
        const newFeedback = new serviceFeedbackModel(req.body);
        await newFeedback.save();
        res.status(201).json({ data: newFeedback, success: true, message: "Service feedback submitted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message || err, error: true, success: false });
    }
}

// Get Service Feedback by ID
async function getServiceFeedbackById(req, res) {
    try {
        const feedback = await serviceFeedbackModel.findById(req.params.id);
        res.status(feedback ? 200 : 404).json(feedback ? { data: feedback, success: true } : { message: "Service feedback not found", error: true });
    } catch (err) {
        res.status(400).json({ message: err.message || err, error: true, success: false });
    }
}

// Get All Service Feedbacks
async function getAllServiceFeedback(req, res) {
    try {
        const feedbacks = await serviceFeedbackModel.find();
        res.status(200).json({ data: feedbacks, success: true, message: "All service feedbacks retrieved successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message || err, error: true, success: false });
    }
}

// Update Service Feedback
const updateServiceFeedback = async (req, res) => {
    try {
        const updatedFeedback = await serviceFeedbackModel.findByIdAndUpdate(
            req.body._id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedFeedback) {
            return res.status(404).json({ success: false, message: "Service feedback not found" });
        }

        res.status(200).json({
            success: true,
            data: updatedFeedback,
            message: "Service feedback updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update service feedback",
            error: error.message
        });
    }
};

// Delete Service Feedback
async function deleteServiceFeedback(req, res) {
    try {
        const deletedFeedback = await serviceFeedbackModel.findByIdAndDelete(req.params.id);
        res.status(deletedFeedback ? 200 : 404).json(deletedFeedback ? { data: deletedFeedback, success: true } : { message: "Service feedback not found", error: true });
    } catch (err) {
        res.status(400).json({ message: err.message || err, error: true, success: false });
    }
}

module.exports = { createServiceFeedback, getServiceFeedbackById, getAllServiceFeedback, updateServiceFeedback, deleteServiceFeedback };
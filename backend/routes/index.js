const express = require('express')

const router = express.Router()

const userSignUpController = require("../controller/userSignUp")
const userSignInController = require('../controller/userSignin')
const userDetailsController = require('../controller/userDetails')
const authToken = require('../middleware/authToken')
const userLogout = require('../controller/userLogout')
const allUsers = require('../controller/allUsers')
const updateUser = require('../controller/updateUser')
const deleteUser = require('../controller/deleteUser')
const { createFeedback, getAllFeedback, getFeedbackById, deleteFeedback, updateFeedback, getUserFeedbacks } = require('../controller/CustomerAffairManagement/feedbackController')
const { createServiceFeedback, getServiceFeedbackById, getAllServiceFeedback, updateServiceFeedback, deleteServiceFeedback } = require('../controller/CustomerAffairManagement/serviceFeedbackController')
const { createBooking, getBookingById, getUserBookingsByMail, getAllBookings, getBookingsByInstructor, updateBooking, deleteBooking, updateBookingStatus } = require('../controller/ScheduleManagement/TimeBookingController')








router.post("/signup",userSignUpController)
router.post("/signin",userSignInController)
router.get("/user-details",authToken,userDetailsController)
router.get("/userLogout", userLogout)

//--member panel--//
const Attendance = require('../models/member_package/Attendance');
//const { createDietPlan } = require('../controller/diet_plan/dietPlanController')

//--admin panel--//
router.get("/all-user",authToken,allUsers)
router.post("/update-user",authToken,updateUser)
router.post("/delete-user", deleteUser);

//--attendance--//

//
//--feedback--//

router.post("/submit-feedback", createFeedback);
router.get("/get-feedbacks", getAllFeedback);
router.get("/get-feedback/:id", getFeedbackById);
router.post("/update-feedback:id", updateFeedback);
router.delete("/delete-feedback/:id", deleteFeedback);

//serviceFeedback

router.post("/submit-service-feedback", createServiceFeedback);
router.get("/get-service-feedback/:id", getServiceFeedbackById);
router.get("/get-service-feedback", getAllServiceFeedback);
router.post("/update-service-feedback:id", updateServiceFeedback);
router.delete("/delete-service-feedback/:id", deleteServiceFeedback);


//TimeBooking update-service-feedback:id update-booking:id

router.post("/create-booking", createBooking)
router.get("/get-booking/:id", getBookingById)
router.get("/get-user-bookings",  getUserBookingsByMail)
router.get("/get-all-bookings",  getAllBookings)
router.get("/get-instructor-bookings/:instructorId",  getBookingsByInstructor)
router.put("/update-booking/:id",  updateBooking)
router.delete("/delete-booking/:id",  deleteBooking)


router.post('/update-status', updateBookingStatus);


//






module.exports = router
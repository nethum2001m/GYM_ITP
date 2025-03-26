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







router.post("/signup",userSignUpController)
router.post("/signin",userSignInController)
router.get("/user-details",authToken,userDetailsController)
router.get("/userLogout", userLogout)


//--admin panel--//
router.get("/all-user",authToken,allUsers)
router.post("/update-user",authToken,updateUser)
router.post("/delete-user", deleteUser);

module.exports = router
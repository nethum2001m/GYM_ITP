const bcrypt = require('bcryptjs')
const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken');
async function userSignInController(req,res) {
    try {
        const { email , password} = req.body

        if(!email){
            throw new Error("Please enter email")
         }
         if(!password){
            throw new Error("Please enter password")
         }

         const user = await userModel.findOne({email})
         
         if(!user){
            throw new Error("User not found")
         }

        console.log("Entered Password:", password);
        console.log("Stored Hashed Password:", user.password);

         
        const checkPassword = await bcrypt.compare(password,user.password)

        console.log("checkPassword",checkPassword)

        const tokenData = {
            _id : user._id,
            email : user.email,
            //role : user.role,

        }

        if(checkPassword){
            const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY , { expiresIn: 60 * 60 * 8});

            const tokenOption = {
                httpOnly : true,
                secure : true,
                
            }

            res.cookie("token",token,tokenOption).status(200).json({
                data : token,
                success : true,
                error : false,
                message : "User Login successfully",
            })
        }
        else{
            throw new Error("Please check Password")
        }

        
    
}
catch (err) {
    res.json({
        message : err.message || err ,
        error : true,
        success : false,
    })
}
}
module.exports = userSignInController
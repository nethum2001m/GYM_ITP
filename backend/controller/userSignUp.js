const userModel = require("../models/userModel")
const bcrypt = require('bcryptjs');

async function userSignUpcontroller(req, res,){
  try{
     const { email, password, name}=req.body

    const user = await userModel.findOne({email}) 

    console.log("User",user)

    if(user){
        throw new Error("Email already exists")
     } 

     if(!email){
        throw new Error("Please enter email")
     }
     if(!password){
        throw new Error("Please enter password")
     }
     if(!name){
        throw new Error("Please enter name")
     }

     const salt = bcrypt.genSaltSync(10);
     const hashPassword = await bcrypt.hashSync("password", salt);

     if(!hashPassword){
        throw new Error("Something is wrong")
     }

     const payload = {
        ...req.body,
        password :  hashPassword
    }

     const userData = new userModel(payload)
     const saveUser = userData.save()

    res.status(201).json({
        data : saveUser,
        success : true,
        error : false,
        message : "User created successfully",
    })

  }catch(err){
    console.log("err",)
    res.json({
        message : err.message || err,
        error : true,
        success : false,
    })
  }
}

module.exports = userSignUpcontroller

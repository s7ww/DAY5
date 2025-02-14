// import module
const express=require('express')
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
require('dotenv').config()
const cors= require("cors")
const User=require('./models/User')

//MIDddlewares
const app=express()
app.use(cors())
app.use(express.json())
const PORT = 5000

//connect to mongodb
mongoose.connect(process.env.MONGO_URI).then(
    ()=> console.log("MONGODB connected")
).catch(
    (err)=>console.log(err)   
)

//register api
app.post('/register',async(req,res)=>{
    const {username,email,password}=req.body  //sending data to db
    try{ 
         const hashedPassword=await bcrypt.hash(password,10)   // encrypt the password using bcrypt 10 times
     const user = new User({username,email,password:hashedPassword}) //creating a new user and pass hashed password
      await user.save()  //save the user to db 
      res.json({message:"User Registered.."})
      console.log("USER REGISTRATION COMPLETED..") 
    } 
    catch(err){
        console.log(err)
    }
})

//login page api
app.post('/login',async(req,res)=>{
    const {email,password}=req.body
    try{
         const user= await User.findOne({email})
         if(!user || !(await bcrypt.compare(password, user.password)))
         {
            return res.status(400).json({message:"Invalid credentials"})
         }
         res.json({message : "Login Successful",username : user.username})

    }
    catch(err){
        console.log(err)
    }
})



app.listen(PORT,()=>
    console.log("SERVER IS RUNNING")
)
import {catchAsyncErrors} from "../Middleware/catchAsyncErrors.js"
import {ErrorHandler} from '../Middleware/errorMiddlewares.js'
import {User} from "../models/userModels.js"
import bcrypt from "bcryptjs"
import { v2 as cloudinary } from "cloudinary";
import { validatePassword } from "../utils/validatePassword.js";

export const getAllUsers=catchAsyncErrors(async(req,res,next)=>{
const users=await User.find({accountVerified:true})
res.status(200).json({
  success:true,
  users,
})
})


export const registerNewAdmin=catchAsyncErrors(async(req,res,next)=>{
  if(!req.files||Object.keys(req.files).length===0){
    return next(new ErrorHandler("Profile picture is required",400));
  }
  const {name,email,password}=req.body;
  if(!name||!email||!password){
    return next(new ErrorHandler("Please fill all the fields",400));
  }
  const isRegistered=await User.findOne({email,accountVerified:true});
  if(isRegistered){
    return next(new ErrorHandler("user already registered, please login",400));
  }

  const validatePasswordError=
  validatePassword(password);
  if(validatePasswordError){
    return next(new ErrorHandler(validatePasswordError,400));
  }
  
const {avatar}=req.files;
const allowedFormats=["image/jpeg","image/png","image/webp"];
if(!allowedFormats.includes(avatar.mimetype)){
  return next(new ErrorHandler("File format is not supported",400));
}
const hashedPassword=await bcrypt.hash(password,10);
const cloudinaryResponse=await cloudinary.uploader.upload(avatar.tempFilePath,
  {folder:"LIBRARY_MANAGEMENT_SYSTEM_ADMIN_AVATARS",}
)
if(!cloudinaryResponse || cloudinaryResponse.error){
  console.error("Cloudinary error:", cloudinaryResponse.error||"Unknown cloudinary error");
  return next(new ErrorHandler("Failed to upload profile picture",500));
}

const admin=await User.create({
  name,
  email,
  password:hashedPassword,
role:"Admin",
accountVerified:true,
avatar:{
  public_id:cloudinaryResponse.public_id,
  url:cloudinaryResponse.secure_url,
},
})

res.status(201).json({
success:true,
message:"Admin registered successfully",
admin
})
})

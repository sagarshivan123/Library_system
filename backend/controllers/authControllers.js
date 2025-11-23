import {User} from '../models/userModels.js';
import {catchAsyncErrors} from '../Middleware/catchAsyncErrors.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ErrorHandler } from '../Middleware/errorMiddlewares.js';
import {sendVerificationCode} from '../utils/sendVerificationCode.js';
import {sendToken} from '../utils/sendToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import { generatePasswordResetEmailTemplate } from '../utils/emailTemplate.js';
import {validatePassword} from '../utils/validatePassword.js'
import crypto from 'crypto';




// Register a user
export const register= catchAsyncErrors(async(req,res,next)=>{
try{
const {name,email,password}=req.body;

if(!name || !email || !password){
  return next(new ErrorHandler("Please enter all fields",400));
}

// Check if user is already registered
const isRegistered=await User.findOne({email , accountVerified:true});


// If user is registered, send error
if(isRegistered){
  return next(new ErrorHandler("User already registered, please login",400));
}

const registerationAttemptsByUser=await User.find({
  email,accountVerified:false
})



// Validate password length
const PasswordValidationError=validatePassword(password);
if(PasswordValidationError){
  return next(new ErrorHandler(PasswordValidationError,400));
}

// Hash password
const hashedPassword=await bcrypt.hash(password,10);

// Create new user
const user=await User.create({
  name,
  email,
  password:hashedPassword,
});

// Generate verification code and save user
const verificationCode= user.generateVerificationCode();
await user.save();
console.log("user",user);
await sendVerificationCode(verificationCode,email );
res.status(200).json({
  success:true,
  message:"Registered successfully.",
})

user.accountVerified=true;
user.verificationCode=null;
user.verificationCodeExpire=null;
await user.save({validateModifiedOnly:true});

}catch(err){
  next(err);
}
})

export const verifyOTP=catchAsyncErrors(async(req,res,next)=>{
const {email,otp}=req.body;
if(!email || !otp){
  return next(new ErrorHandler("Email or otp is missing",400));
}
try{
  const userAllEntries=await User.find({email,accountVerified:false}).sort({createdAt:-1});

  if(!userAllEntries){
    return next(new ErrorHandler("User not found",400));
  }

  let user;
  if(userAllEntries.length>1){
    user=userAllEntries[0];
    await User.deleteMany({
      _id:{$ne:user._id},
      email,
      accountVerified:false
    })
  }
  else{
    user=userAllEntries[0];
  }


  if(user.verificationCode!==Number(otp)){
    return next(new ErrorHandler("Invalid or expired OTP",400));
  }

  const currentTime=Date.now();

  const verificationCodeExpireTime=new Date(user.verificationCodeExpire).getTime();

  if(currentTime>verificationCodeExpireTime){
    return next(new ErrorHandler("Invalid or expired OTP",400));
  }
  user.accountVerified=true;
  user.verificationCode=null;
  user.verificationCodeExpire=null;
  await user.save({validateModifiedOnly:true});

  sendToken(user, 200 ,"Account verified successfully",res);

}catch(err){
  return next(new ErrorHandler("internal server error",500));
}
})

export const login=catchAsyncErrors(async(req,res,next)=>{
  const {email,password}=req.body;
  if(!email || !password){
    return next(new ErrorHandler("Please enter all fields",400));
  }
  const user=await User.findOne({email,accountVerified:true}).select("+password");
  if(!user){
    return next(new ErrorHandler("Invalid email or password",400));
  }
  const isPasswordMatched=await bcrypt.compare(password,user.password);
  if(!isPasswordMatched){
    return next(new ErrorHandler("Invalid email or password",400));
  }
  sendToken(user,200,"Login successful",res);
})

export const logOut=catchAsyncErrors(async(req,res,next)=>{
  res.status(200).cookie("token",null,{
    expires:new Date(Date.now()),
    httpOnly:true,
  }).json({
    success:true,
    message:"Logged out successfully",
  })
})

export const getUser=catchAsyncErrors(async(req,res,next)=>{ 
  console.log("User data retrieved successfully");
  const user=req.user;
  res.status(200).json({
    success:true,
    user,
  })
}
);

export const forgotPassword=catchAsyncErrors(async(req,res,next)=>{
// console.log("🔔 Forgot Password request received");
  if(!req.body.email){
    return next(new ErrorHandler("Email is required",400));
  }

const user=await User.findOne({
  email:req.body.email,
  accountVerified:true,
})
if(!user){
  return next(new ErrorHandler("invalid email",400));
}
const resetToken=user.getResetPasswordToken();
// console.log("generated reset token",resetToken);
await user.save({validateBeforeSave:false});
// console.log(
//   "resetPasswordToken:", resetToken
// );

const resetPasswordUrl=`${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
// console.log("resetPasswordUrl:", resetPasswordUrl);
const message= generatePasswordResetEmailTemplate(resetPasswordUrl);
// console.log("resetPasswordExpire:", user?.resetPasswordExpire);
// console.log("Current time:", Date.now());

try{
  await sendEmail({
    email:user.email,
    subject:`Bookworm Library Management System - Password Recovery`,
    message,
  });
  res.status(200).json({
    success:true,
    message:`Email sent to ${user.email} successfully`,
  })
}catch(err){
  
  user.resetPasswordToken=undefined;
  user.resetPasswordExpire=undefined;
  await user.save({validateBeforeSave:false});
  return next(new ErrorHandler(err.message || "Cannot send email",500));
}
})

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { resetPasswordToken } = req.params; // make sure route param name matches
  
  const cleanToken = decodeURIComponent(resetPasswordToken.trim());
  console.log("🧼 Cleaned token:", JSON.stringify(cleanToken), cleanToken.length);
  
  const user = await User.findOne({ resetPasswordToken: cleanToken });

console.log("user is ",user);
  if (!user) {
    return next(new ErrorHandler("Invalid or expired password reset token", 400));
  }

  // Validate passwords
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password and confirm password do not match", 400));
  }
  const isPasswordValidate = validatePassword(password, confirmPassword);
  if (isPasswordValidate) {
    return next(new ErrorHandler(isPasswordValidate, 400));
  }

  // Hash and update password
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, "Password reset successful", res);
});

export const updatePassword=catchAsyncErrors(async(req,res,next)=>{
const user=await User.findById(req.user._id).select("+password");

const {currentPassword,newPassword,confirmNewPassword}=req.body;

if(!currentPassword || !newPassword || !confirmNewPassword){
  return next(new ErrorHandler("Please enter all fields",400));
}
const isPasswordMatched=await bcrypt.compare(currentPassword,user.password);
if(!isPasswordMatched){
  return next(new ErrorHandler("Current password is incorrect",400));
}

const isPasswordValidate=validatePassword(newPassword,confirmNewPassword);
if(isPasswordValidate){
  return next(new ErrorHandler(isPasswordValidate,400));
}

const hashedPassword=await bcrypt.hash(newPassword,10);
user.password=hashedPassword;
await user.save();
res.status(200).json({
  success:true,
  message:"Password updated successfully",
})
})
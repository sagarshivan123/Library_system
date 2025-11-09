import express from 'express';
import { isAuthenticated } from '../Middleware/authMiddleware.js';
import { register,verifyOTP,login,logOut,getUser,forgotPassword,resetPassword,updatePassword } from '../controllers/authControllers.js';

const router=express.Router();
router.post("/register",register);
router.post("/verify-otp",verifyOTP);
router.post("/login",login);
router.get("/logOut",logOut);
router.get("/me",isAuthenticated,getUser);
router.post("/password/forgot",forgotPassword);
router.put("/password/reset/:resetPasswordToken",resetPassword);
router.put("/password/update",isAuthenticated,updatePassword);


export default router;
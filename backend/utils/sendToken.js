
// import jwt from 'jsonwebtoken';
// export const sendToken=(user,statusCode,message,res)=>{

//   const token=user.generateToken();
//   res.
//   status(statusCode).
//   cookie("token",token,{
//     expires:new Date(Date.now()+process.env.COOKIE_EXPIRE*24*60*60*1000),
//     httpOnly:true,
//     secure: true, 
//       sameSite: "none",    
//   }).json({
//     success:true,
//     message,
//     user,
//     token,
//   })
// }
import jwt from 'jsonwebtoken';

export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();

  res.status(statusCode).cookie("token", token, {
    httpOnly: true,
    secure: true,      // must be true on HTTPS
    sameSite: "none",  // allows cross-site cookie sharing
    maxAge: process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
  }).json({
    success: true,
    message,
    user,
    token,
  });
};

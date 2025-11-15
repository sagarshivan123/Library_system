import jwt from 'jsonwebtoken';

export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();

  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE) || 7;
  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
  };

  res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    message,
    user,
    token,
  });
};




// import jwt from 'jsonwebtoken';

// export const sendToken = (user, statusCode, message, res) => {
//   const token = user.generateToken();

//   res.status(statusCode).cookie("token", token, {
//     httpOnly: true,
//     secure: true,      // must be true on HTTPS
//     sameSite: "none",  // allows cross-site cookie sharing
//     maxAge: process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
//   }).json({
//     success: true,
//     message,
//     user,
//     token,
//   });
// };

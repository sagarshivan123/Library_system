// import express from 'express'
// import expressFileUpload from 'express-fileupload'
// const app=express();
// import  cookieParser from 'cookie-parser';
// import  cors from 'cors';
// import dotenv from "dotenv";
// import connectDB  from "./database/db.js";
// dotenv.config({ path: "config/.env" });
// import  authRouter from './routes/authRouter.js';
// import  bookRouter from './routes/bookRouter.js';
// import  borrowRouter from './routes/borrowRouter.js';
// import  userRouter from './routes/userRouter.js';
// import  {notifyUsers} from'./services/notifyUsers.js';
// import  {removeUnverifiedAccounts} from './services/removeUnverifiedAccount.js';

// import  {errorMiddleware} from './Middleware/errorMiddlewares.js';

// app.use((req, res, next) => {
//   console.log(`➡️ ${req.method} ${req.originalUrl}`);
//   next();
// });


// app.use(cors({
//   origin:[
//     "http://localhost:3000",  
//     "http://127.0.0.1:5500", 
//     "http://localhost:5173",
//     "https://library-system-git-main-sagarshivan123s-projects.vercel.app",
//     "https://library-system-quok999il-sagarshivan123s-projects.vercel.app"
//   ],
//   methods:["GET","POST","PUT","DELETE"],
//   credentials:true,
// }));

// app.use(cookieParser())
// app.use(express.json());


// app.use(express.urlencoded({extended:true}));
// app.use(expressFileUpload({
//     useTempFiles:true,
//     tempFileDir:"/tmp/",
// }));

// app.set("trust proxy", 1);
// app.use("/api/v1/auth",authRouter);
// app.use("/api/v1/book",bookRouter);
// app.use("/api/v1/borrow",borrowRouter);
// app.use("/api/v1/user",userRouter);

// notifyUsers();
// removeUnverifiedAccounts();
// // connect to database
// connectDB();

// app.use(errorMiddleware);
// export default app;

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './database/db.js';
import authRouter from './routes/authRouter.js';
import bookRouter from './routes/bookRouter.js';
import borrowRouter from './routes/borrowRouter.js';
import userRouter from './routes/userRouter.js';
import { notifyUsers } from './services/notifyUsers.js';
import { removeUnverifiedAccounts } from './services/removeUnverifiedAccount.js';
import { errorMiddleware } from './Middleware/errorMiddlewares.js';

dotenv.config({ path: 'config/.env' });
const app = express();

// Logging
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:5500",
  "http://localhost:5173",
  "https://library-system-navy-two.vercel.app",
  "https://library-system-quok999il-sagarshivan123s-projects.vercel.app",
  "https://library-system-git-main-sagarshivan123s-projects.vercel.app"
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // for Postman or server-to-server requests
    if(allowedOrigins.indexOf(origin) === -1){
      return callback(new Error('CORS policy: Origin not allowed'));
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE"]
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload
import expressFileUpload from 'express-fileupload';
app.use(expressFileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/"
}));

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/borrow", borrowRouter);
app.use("/api/v1/user", userRouter);

// Background jobs
notifyUsers();
removeUnverifiedAccounts();

// Connect database
connectDB();

// Error middleware
app.use(errorMiddleware);

export default app;

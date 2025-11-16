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
import path from "path";

dotenv.config({ path: 'config/.env' });
const app = express();

// add trust proxy so Express knows it's behind Render's proxy (needed for secure cookies)
app.set('trust proxy', 1);

// Logging
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL, // add your Vercel frontend URL in Render env as FRONTEND_URL
  "http://localhost:3000",
  "http://127.0.0.1:5500",
  "http://localhost:5173",
  "https://library-system-navy-two.vercel.app",
  "https://library-system-quok999il-sagarshivan123s-projects.vercel.app",
  "https://library-system-git-main-sagarshivan123s-projects.vercel.app"
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow non-browser tools (no origin) and same-origin requests
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`CORS blocked origin: ${origin}`);
    return callback(new Error('CORS policy: Origin not allowed'));
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

app.use(express.static(path.join(process.cwd(), "frontend", "dist")));

app.get('/:path*', (req, res) => {
  res.sendFile(path.join(process.cwd(), "frontend", "dist", "index.html"));
});

// Background jobs
notifyUsers();
removeUnverifiedAccounts();

// Connect database
connectDB();

// Error middleware
app.use(errorMiddleware);

export default app;

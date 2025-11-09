
import app from './app.js';
import dotenv from 'dotenv';
dotenv.config(); 
import { v2 as cloudinary } from 'cloudinary';

const PORT=process.env.PORT||5000;
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLIENT_NAME,
    api_key:process.env.CLOUDINARY_CLIENT_API,
    api_secret:process.env.CLOUDINARY_CLIENT_SECRET,
    secure:true
})
app.listen( PORT,()=>{
    console.log(`Server is running on http://localhost: ${PORT} `);
})





const app=require('./app');
const cloudinary=require('cloudinary').v2;

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
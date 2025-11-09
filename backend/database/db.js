import mongoose from "mongoose";

const connectDB=()=>{
    mongoose.connect(process.env.MONGO_URI,{
       dbName:"MERN_STACK_LIBRARY_MANAGEMENT",
      //  useNewUrlParser: true,
      //  useUnifiedTopology: true
    }).then(()=>{
        console.log("Database connected successfully");
    }).catch((err)=>{
        console.log("Database connection failed");
        console.log(err);
        process.exit(1);
    });
}
export default connectDB;
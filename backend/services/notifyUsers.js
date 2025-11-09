import cron from 'node-cron';
import {User} from '../models/userModels.js';
import {Borrow} from '../models/borrowModel.js';
import {sendEmail} from '../utils/sendEmail.js';

export const notifyUsers=()=>{
  cron.schedule("*/10 * * * * *",async()=>{
    try {
      const oneDayAgo=new Date(Date.now()-24*60*60*1000);
      const borrowers=await Borrow.find({
        dueDate:{
          $lt:oneDayAgo,
        },
        returnDate:null,
        notified:false,
      })

      for(const element of borrowers){
        if(element.user && element.user.email){
          const user=await User.findById(element.user.id);
          sendEmail({
            email:element.user.email,
            subject:"Book Return Reminder",
            message:`Hello ${element.user.name},\n\nThis is a reminder that the book you borrowed is overdue. Please return it as soon as possible to avoid further penalties.\n\nThank you,\nLibrary Team`
          })
          element.notified=true;
          await element.save();
          console.log("Notification sent to user:",element.user.email);
        }
      }
    } catch (error) {
      console.error("some error occured while sending notifications to users");
    }
  })

}

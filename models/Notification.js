import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  createdAt: { type: Date, expires: 60*60*24*14, default: Date.now },
  postId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Post"
    },
  text: String
  
});



module.exports = mongoose.model("Notification", notificationSchema);
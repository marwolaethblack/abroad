import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  postId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Post"
    },
  text: String,
  seen: { type: Boolean, default: false, required: true }
  
});



module.exports = mongoose.model("Notification", notificationSchema);
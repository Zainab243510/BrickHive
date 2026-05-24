import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  propertyTitle: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  image: { type: String },

});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;

const mongoose = require('mongoose');
const sellerSchema = require('./sellerSchema');
const stockSchema = require('./stockSchema');
const messageSchema = require('./messageSchema');

// Notification Schema
const notificationSchema = new mongoose.Schema({
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  sender: { type: mongoose.Schema.Types.ObjectId, refPath: 'senderModel' }, // Reference to sender (seller or user)
  senderModel: { type: String, enum: ['Seller', 'User'] }, // Indicates the type of sender
  type: { type: String, enum: ['NewSeller', 'NewStock', 'NewMessage'], required: true },
  relatedEntity: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Stock' }, // Reference to related entity (stock)
});

// Pre-save hook to populate senderModel based on the type of sender
notificationSchema.pre('save', function(next) {
  if (this.sender instanceof mongoose.Types.ObjectId) {
    this.senderModel = 'Seller';
  } else {
    this.senderModel = 'User';
  }
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);

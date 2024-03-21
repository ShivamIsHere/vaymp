
// const mongoose = require('mongoose');

// // User Schema (for both admin and seller)
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['admin', 'seller'], required: true }
// });

// // Product Schema
// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   price: { type: Number, required: true },
//   shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }
// });

// // Shop Schema
// const shopSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
// });

// // Order Schema
// const orderSchema = new mongoose.Schema({
//   product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//   status: { type: String, enum: ['pending', 'shipped', 'delivered'], required: true },
//   buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
// });

// // Event Schema
// const eventSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   date: { type: Date, required: true }
// });

// // Notification Schema
// const notificationSchema = new mongoose.Schema({
//   content: { type: String, required: true },
//   date: { type: Date, default: Date.now }
// });

// // Coupon Schema
// const couponSchema = new mongoose.Schema({
//   code: { type: String, required: true, unique: true },
//   discount: { type: Number, required: true },
//   expirationDate: { type: Date, required: true }
// });

// // Carousel Schema
// const carouselSchema = new mongoose.Schema({
//   items: [{
//     image: { type: String, required: true },
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     link: { type: String, required: true }
//   }]
// });

// // Export the models
// module.exports = {
//   User: mongoose.model('User', userSchema),
//   Product: mongoose.model('Product', productSchema),
//   Shop: mongoose.model('Shop', shopSchema),
//   Order: mongoose.model('Order', orderSchema),
//   Event: mongoose.model('Event', eventSchema),
//   Notification: mongoose.model('Notification', notificationSchema),
//   Coupon: mongoose.model('Coupon', couponSchema),
//   Carousel: mongoose.model('Carousel', carouselSchema)
// };





const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Order = require("../model/order");
const Shop = require("../model/shop");
const Product = require("../model/product");
const axios = require("axios");
// Create new order
router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

      // Group cart items by shopId
      const shopItemsMap = new Map();

      for (const item of cart) {
        const shopId = item.shopId;
        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }
        shopItemsMap.get(shopId).push(item);
      }

      // Create an order for each shop
      const orders = [];

      for (const [shopId, items] of shopItemsMap) {
        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
        });
        orders.push(order);

        // Update stock for each item in the shop's cart
        for (const item of items) {
          await updateStockAfterOrderCreation(item);
        }
      }

      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);



// Update stock for a single product
router.put(
  "/update-stock/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;
      const { stock } = req.body; // New stock value from the request body

      // Find the product by ID in the database
      const product = await Product.findById(productId);

      // Check if the product exists
      if (!product) {
        return next(new ErrorHandler(`Product not found with ID: ${productId}`, 404));
      }

      // Update the product's stock
      product.stock = stock;

      // Save the updated product
      await product.save();

      // Send success response
      res.status(200).json({
        success: true,
        message: "Product stock updated successfully",
        product,
      });
    } catch (error) {
      // Handle errors appropriately
      console.error("Error updating product stock:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// Function to update stock using Axios after creating orders
async function updateStockAfterOrderCreation(item) {
  console.log("Updating stock for item:", item);
  const productId = item._id; // Use _id for Product ID
  const quantity = item.qty;

  console.log("Product ID:", productId);
  console.log("Quantity:", quantity);

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error(`Product not found with ID: ${productId}`);
  }

  // Update the product's stock
  product.stock -= quantity;
  console.log("Updated stock:", product.stock);

  try {
    // Make HTTP PUT request to update stock using Axios
    const response = await axios.put(`http://localhost:8000/api/v2/order/update-stock/${productId}`, {
      stock: product.stock, // Update the stock value in the request body
    });

    // Log the response data received from the server
    console.log("Response from server:", response.data);

    // Check if the request was successful
    if (response.status >= 200 && response.status < 300) {
      console.log("Stock updated successfully");
    } else {
      throw new Error(`Failed to update stock - Unexpected status code: ${response.status}`);
    }
  } catch (error) {
    // Handle Axios errors
    console.error("Error updating stock:", error.message);
    throw new Error("Failed to update stock");
  }

  // Save the updated product
  await product.save();
}

























// get all orders of user
router.get(
  "/get-all-orders/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({ "user._id": req.params.userId }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders of seller
router.get(
  "/get-seller-all-orders/:shopId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({
        "cart.shopId": req.params.shopId,
      }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update order status for seller
router.put(
  "/update-order-status/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }
      console.log(req.body.status)
      if (req.body.status === "Transferred to delivery partner") {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }

      order.status = req.body.status;

      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
        order.paymentInfo.status = "Succeeded";
        // const serviceCharge = order.totalPrice * .10;
        // await updateSellerInfo(order.totalPrice - serviceCharge);
        // const serviceCharge = order.totalPrice ;
        await updateSellerInfo(order.totalPrice);
      }

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
      });

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock -= qty;
        product.sold_out += qty;


        await product.save({ validateBeforeSave: false });
      }

      async function updateSellerInfo(amount) {
        const seller = await Shop.findById(req.seller.id);
        
        seller.availableBalance = amount;

        await seller.save();
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// give a refund ----- user
router.put(
  "/order-refund/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = req.body.status;

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: "Order Refund Request successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// accept the refund ---- seller
router.put(
  "/order-refund-success/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = req.body.status;

      await order.save();

      res.status(200).json({
        success: true,
        message: "Order Refund successfull!",
      });

      if (req.body.status === "Refund Success") {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock += qty;
        product.sold_out -= qty;

        await product.save({ validateBeforeSave: false });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all orders --- for admin
router.get(
  "/admin-all-orders",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find().sort({
        deliveredAt: -1,
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
// Update product stock by admin
// router.put(
//   "/update-product-stock/:id",
//   isAdmin("Admin"),
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const productId = req.params.id;
//       const newStock = req.body.stock; // Assuming the request body contains the new stock value

//       // Find the product by ID
//       const product = await Product.findById(productId);

//       if (!product) {
//         return next(new ErrorHandler(`Product not found with ID: ${productId}`, 404));
//       }

//       // Update the product's stock
//       product.stock = newStock;

//       // Save the updated product
//       await product.save();

//       res.status(200).json({
//         success: true,
//         message: "Product stock updated successfully!",
//         product,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

module.exports = router;




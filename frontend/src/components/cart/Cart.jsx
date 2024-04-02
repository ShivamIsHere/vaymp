// import React, { useState } from "react";
// import { RxCross1 } from "react-icons/rx";
// import { IoBagHandleOutline } from "react-icons/io5";
// import { HiOutlineMinus, HiPlus } from "react-icons/hi";
// import styles from "../../styles/styles";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { addTocart, removeFromCart } from "../../redux/actions/cart";
// import { toast } from "react-toastify";

// const Cart = ({ setOpenCart }) => {
//   // Redux state and dispatch
//   const { cart } = useSelector((state) => state.cart);
//   console.log("cart",cart)
//   const dispatch = useDispatch();

//   // Remove item from cart handler
//   const removeFromCartHandler = (data) => {
//     dispatch(removeFromCart(data));
//   };

//   // Calculate total price of items in cart
//   const totalPrice = cart.reduce(
//     (acc, item) => acc + item.qty * item.discountPrice,
//     0
//   );

//   // Handler for changing quantity of an item in cart
//   const quantityChangeHandler = (data, selectedSize, quantity) => {
//     // Find the selected size in the item's stock
//     const selectedStock = data.stock.find((item) => item.size === selectedSize);
  
//     console.log('selectedStock:', selectedStock); // Log selectedStock
  
//     // Check if selected size is found in stock
//     if (!selectedStock) {
//       console.error(`Stock information not found for size ${selectedSize}`);
//       return;
//     }
  
//     // Check if quantity exceeds available stock for the selected size
//     if (quantity > selectedStock.quantity) {
//       toast.error(`Only ${selectedStock.quantity} items available in size ${selectedSize}`);
//       return;
//     }
  
//     // Create a deep copy of the item's stock array
//     const updatedStock = JSON.parse(JSON.stringify(data.stock));
  
//     console.log('updatedStock before update:', updatedStock); // Log updatedStock before update
  
//     // Find the index of the selected size in the updated stock array
//     const selectedStockIndex = updatedStock.findIndex((item) => item.size === selectedSize);
  
//     console.log('selectedStockIndex:', selectedStockIndex); // Log selectedStockIndex
  
//     // Update the quantity for the selected size directly to the new quantity (qty)
//     updatedStock[selectedStockIndex].quantity = quantity;
  
//     console.log('updatedStock after update:', updatedStock); // Log updatedStock after update
  
//     // Create updated cart data with new quantity, size, and updated stock
//     const updatedCartData = { ...data, qty: quantity, size: selectedSize, stock: updatedStock };
  
//     console.log('updatedCartData:', updatedCartData); // Log updatedCartData
  
//     // Dispatch action to update cart in Redux state
//     dispatch(addTocart(updatedCartData));
//   };
  
  
//   // JSX for Cart component
//   return (
//     <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
//       <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
//         {/* Cart items list */}
//         {cart && cart.length === 0 ? (
//                     // Empty cart message
//                     <div className="w-full h-screen flex items-center justify-center">
//                     <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
//                       <RxCross1
//                         size={25}
//                         className="cursor-pointer"
//                         onClick={() => setOpenCart(false)}
//                       />
//                     </div>
//                     <h5>Cart Items is empty!</h5>
//                   </div>
//                 ) : (
//                   // Cart items list
//                   <>
//                     <div>
//                       {/* Close cart button */}
//                       <div className="flex w-full justify-end pt-5 pr-5">
//                         <RxCross1
//                           size={25}
//                           className="cursor-pointer"
//                           onClick={() => setOpenCart(false)}
//                         />
//                       </div>
//                       {/* Total number of items in cart */}
//                       <div className={`${styles.noramlFlex} p-4`}>
//                         <IoBagHandleOutline size={25} />
//                         <h5 className="pl-2 text-[20px] font-[500]">
//                           {cart && cart.length} items
//                         </h5>
//                       </div>
        
//                       {/* Cart items list */}
//                       <br />
//                       <div className="w-full border-t">
//                         {cart &&
//                           cart.map((item, index) => (
//                             <CartSingle
//                               key={index}
//                               data={item}
//                               quantityChangeHandler={quantityChangeHandler}
//                               removeFromCartHandler={removeFromCartHandler}
//                             />
//                           ))}
//                       </div>
//                     </div>
        
//                     {/* Checkout button */}
//                     <div className="px-5 mb-3">
//                       <Link to="/checkout">
//                         <div className={`h-[45px] flex items-center justify-center w-[100%] bg-[#e44343] rounded-[5px]`}>
//                           <h1 className="text-[#fff] text-[18px] font-[600]">
//                             Checkout Now (USD${totalPrice})
//                           </h1>
//                         </div>
//                       </Link>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           );
//         };
        
        

// const CartSingle = ({
//   data,
//   quantityChangeHandler,
//   removeFromCartHandler,
// }) => {
//   const [selectedSize, setSelectedSize] = useState(data.size);
//   const [value, setValue] = useState(data.qty);
//   const totalPrice = data.discountPrice * value;
//   const dispatch = useDispatch();

//   const increment = () => {
//     const updatedValue = value + 1;
//     setValue(updatedValue);
//     quantityChangeHandler(data, selectedSize, updatedValue);
//   };

//   const decrement = () => {
//     // Check if the current value is greater than 1 before decrementing
//     if (value > 1) {
//       const updatedValue = value - 1;
//       setValue(updatedValue);
//       quantityChangeHandler(data, selectedSize, updatedValue);
//     } else {
//       // Show a toast message or handle the case where quantity is already at its minimum
//       console.log('Quantity cannot be less than 1.');
//     }
//   };
  

//   const handleSizeChange = (e) => {
//     setSelectedSize(e.target.value);
//     quantityChangeHandler(data, e.target.value, value); // Pass the updated value here
//   };

//   return (
//     <div className="border-b p-4">
//       <div className="w-full flex items-center">
//         {/* Increment, Decrement buttons */}
//         <div>
//           {/* Increment button */}
//           <div
//             className={`bg-[#e44343] border border-[#e4434373] rounded-full w-[25px] h-[25px] ${styles.noramlFlex} justify-center cursor-pointer`}
//             onClick={increment}
//           >
//             <HiPlus size={18} color="#fff" />
//           </div>
//           <span className="pl-[10px]">{value}</span>
//           {/* Decrement button */}
//           <div
//             className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
//             onClick={decrement}
//           >
//             <HiOutlineMinus size={16} color="#7d879c" />
//           </div>
//         </div>

//         {/* Display product image */}
//         <img
//           src={`${data?.images[0]?.url}`}
//           alt=""
//           className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
//         />

//         {/* Product details */}
//         <div className="pl-[5px]">
//           <h1>{data.name}</h1>
//           <div className="flex items-center">
//             <label htmlFor={`sizeSelect-${data._id}`} className="font-medium text-gray-800">
//               Select Size:
//             </label>
//             <select
//               id={`sizeSelect-${data._id}`}
//               className="ml-2 bg-gray-100 rounded px-2 py-1 focus:outline-none"
//               value={selectedSize}
//               onChange={handleSizeChange}
//             >
//               <option value="S">S</option>
//               <option value="M">M</option>
//               <option value="L">L</option>
//               <option value="XL">XL</option>
//             </select>
//           </div>
//           <h4 className="font-[400] text-[15px] text-[#00000082]">
//             ${data.discountPrice} * {value}
//           </h4>
//           <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto">
//             US${totalPrice}
//           </h4>
//         </div>

//         {/* Remove item button */}
//         <RxCross1
//           className="cursor-pointer"
//           onClick={() => removeFromCartHandler(data)}
//         />
//       </div>
//     </div>
//   );
// };



// export default Cart;





import React, { useState, useEffect, useRef } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart, removeFromCart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const cartRef = useRef(null);

  const dispatch = useDispatch();
console.log("cartjj",cart)
  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );
  const handleCloseClick = (event) => {
    // Check if the click target is the overlay (wishlistRef) itself
    if (cartRef.current === event.target) {
      setOpenCart(false);
    }
  };

   const addToCartHandler = async (id, selectedSize, count,data,st) => {
    let p=JSON.stringify(data)
    let oldData=JSON.parse(p)
    oldData.qty=count;
   // console.log("oldData",oldData.stock,count)
   const l= oldData.stock.map((val)=>{
     // console.log("val",val)
      if(val.size==selectedSize){
        if(st=="inc"){
          console.log("inc",val.quantity)
    val.quantity=val.quantity-1
        }else{
          console.log("dec",val.quantity)
          val.quantity=val.quantity+1
        }

      }
      return val
    })
    oldData.stock=l
    console.log("lllll",oldData)
  //   const isItemExists = cart && cart.find((i) => i._id === id);
  //   if (isItemExists) {
  //     toast.error("aItem alredy in cart!");
  //   } else {
  //     if (selectedSize === '') {
  //       toast.error("Please select a size!");
  //     } else {
  //       const selectedProduct = data.stock.find((item) => item.size === selectedSize);
  //       if (!selectedProduct || selectedProduct.quantity < 1) {
  //         toast.error("Selected size not available or out of stock!");
  //       } else {
  //         const updatedStock = data.stock.map((item) =>
  //           item.size === selectedSize
  //             ? { ...item, quantity: item.quantity - count }
  //             : item
  //         );
  //         const cartData = { ...data, stock: updatedStock, qty: count,size: selectedSize };
  // console.log("data",data)
  // console.log("stock",updatedStock)
  
          try {
            
            // await updateStockAfterOrderCreation(itemToUpdate);
            dispatch(addTocart(oldData));
           // toast.success("Item added to cart successfully!");
          } catch (error) {
            console.error("Error updating stock:", error.message);
            toast.error("Failed to change item to cart!");
          }
  //       }
  //     }
  //   }
   };






  const quantityChangeHandler = (data, quantity,st) => {
    // const updateCartData = { ...data, qty: quantity };
    addToCartHandler(data._id,data.size,quantity,data,st)
     console.log("ffffffff",quantity,data)
    // dispatch(addTocart(updateCartData));
  };
 

  return (
<div 
      ref={cartRef}
      className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10"
      onClick={handleCloseClick}
      >
        <div
        className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm"
        ref={cartRef}>
        {cart && cart.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <h5>Cart Items is empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenCart(false)}
                />
              </div>
              {/* Item length */}
              <div className={`${styles.noramlFlex} p-4`}>
                <IoBagHandleOutline size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {cart && cart.length} items
                </h5>
              </div>

              {/* cart Single Items */}
              <br />
              <div className="w-full border-t">
                {cart &&
                  cart.map((i, index) => (
                    <CartSingle
                      key={index}
                      data={i}
                      quantityChangeHandler={quantityChangeHandler}
                      removeFromCartHandler={removeFromCartHandler}
                    />
                  ))}
              </div>
            </div>

            <div className="px-5 mb-3">
              {/* checkout buttons */}
              <Link to="/checkout">
                <div
                  className={`h-[45px] flex items-center justify-center w-[100%] bg-[#e44343] rounded-[5px]`}
                >
                  <h1 className="text-[#fff] text-[18px] font-[600]">
                  Checkout Now (Rs.{totalPrice})
                  </h1>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [selectedSize, setSelectedSize] = useState(data.size); // Example: Initialize selected size state
  const [value, setValue] = useState(data.qty);
  const totalPrice = data.discountPrice * value;
  

  const increment = () => {
    console.log("mydata",selectedSize)
    const stock = data.stock.find((item) => item.size === selectedSize);
    if (stock && stock.quantity - 1 < value) {
      toast.error("Product stock limited!");
    } else {
      setValue(value + 1);
      quantityChangeHandler(data, value + 1,"inc");
    }
  };

  const decrement = () => {
    setValue(value === 1 ? 1 : value - 1);
    quantityChangeHandler(data, value === 1 ? 1 : value - 1,"dec");
  };

  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center">
        <div>
          <div
            className={`bg-[#e44343] border border-[#e4434373] rounded-full w-[25px] h-[25px] ${styles.noramlFlex} justify-center cursor-pointer`}
            onClick={increment}
          >
            <HiPlus size={18} color="#fff" />
          </div>
          <span className="pl-[10px]">{value}</span>
          <div
            className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
            onClick={decrement}
          >
            <HiOutlineMinus size={16} color="#7d879c" />
          </div>
        </div>
        
        <img
          src={`${data?.images[0]?.url}`}
          alt=""
          className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
        />
        <div>{selectedSize}</div>
        <div className="pl-[5px]">
          <h1>{data.name}</h1>
          <h4 className="font-[400] text-[15px] text-[#00000082]">
          Rs.{data.discountPrice} * {value}
          </h4>
          <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto">
          Rs.{totalPrice}
          </h4>
        </div>
        <RxCross1
          className="cursor-pointer"
          onClick={() => removeFromCartHandler(data)}
        />
      </div>
    </div>
  );
};

export default Cart;

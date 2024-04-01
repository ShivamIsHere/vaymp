// import { createReducer } from "@reduxjs/toolkit";

// const initialState = {
//   cart: localStorage.getItem("cartItems")
//     ? JSON.parse(localStorage.getItem("cartItems"))
//     : []
// };
// export const cartReducer = createReducer(initialState, {
//   addToCart: (state, action) => {
//     const item = action.payload;
//     console.log("item90", item);
//     // const isItemExists =
//     //   state.cart.find((i) => {
//     //     // console.log("iiiiiiiiii", i);
//     //     const m1 = i.stock.find((ite) => {
//     //       return ite._id == id;
//     //     });
//     //     console.log("m1m1", m1);
//     //     if (m1 == undefined) {
//     //       return false;
//     //     } else {
//     //       return true;
//     //     }
//     //     // return i._id === id;
//     //   });

   

//     const isItemExist = state.cart.find((i) => i.stock[0].size === item.stock[0].size);
//     if (isItemExist) {
//       return {
//         ...state,
//         cart: state.cart.map((i) => (i._id === isItemExist._id ? item : i))
//       };
//     } else {
//       return {
//         ...state,
//         cart: [...state.cart, item]
//       };
//     }
//   },

//   // export const cartReducer = createReducer(initialState, {
//   //   addToCart: (state, action) => {
//   //     const item = action.payload;
//   //     console.log("item90",item)
//   //     const isItemExist = state.cart.find((i) => i._id === item._id);
//   //     if (isItemExist) {
//   //       return {
//   //         ...state,
//   //         cart: state.cart.map((i) => (i._id === isItemExist._id ? item : i)),
//   //       };
//   //     } else {
//   //       return {
//   //         ...state,
//   //         cart: [...state.cart, item],
//   //       };
//   //     }
//   //   },

//   removeFromCart: (state, action) => {
//     return {
//       ...state,
//       cart: state.cart.filter((i) => i._id !== action.payload)
//     };
//   }
// });




import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  cart: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
};

export const cartReducer = createReducer(initialState, {
  addToCart: (state, action) => {
    const item = action.payload;
    const isItemExist = state.cart.find(
      (i) => i._id === item._id && i.size === item.size
    );

    if (isItemExist) {
      // Update quantity if the item with the same size exists
      return {
        ...state,
        cart: state.cart.map((i) =>
          i._id === isItemExist._id && i.size === isItemExist.size
            ? { ...item, quantity: i.quantity + item.quantity }
            : i
        ),
      };
    } else {
      // Add item to cart if it's a new size
      return {
        ...state,
        cart: [...state.cart, item],
      };
    }
  },

  removeFromCart: (state, action) => {
    return {
      ...state,
      cart: state.cart.filter((i) => i._id !== action.payload),
    };
  },
});

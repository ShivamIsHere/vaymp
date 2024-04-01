// // add to cart
// export const addTocart = (data) => async (dispatch, getState) => {
//   dispatch({
//     type: "addToCart",
//     payload:data,
//   });

//   localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
//   return data;
// };

// // remove from cart
// export const removeFromCart = (data) => async (dispatch, getState) => {
//   dispatch({
//     type: "removeFromCart",
//     payload: data._id,
//   });
//   localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
//   return data;
// };




// addTocart action
export const addTocart = (data) => async (dispatch, getState) => {
  const { cart } = getState().cart;
  const { stock, ...restData } = data;
  const { size, qty } = restData; // Destructure size and qty from restData

  // Check if the selected size already exists in the cart
  const existingProduct = cart.find(
    (item) => item._id === restData._id && item.size === size
  );

  if (existingProduct) {
    // If the selected size already exists, update its quantity in the cart
    const updatedCart = cart.map((item) =>
      item._id === existingProduct._id && item.size === size
        ? { ...item, quantity: item.quantity + qty }
        : item
    );

    dispatch({
      type: "updateCart",
      payload: updatedCart,
    });

    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  } else {
    // If the selected size does not exist, create a new cart item
    // Avoid changing the isSelected and quantity of other sizes
    const updatedStock = stock.map((item) => {
      if (item.size === size) {
        return {
          ...item,
          quantity: item.quantity - qty,
          isSelected: true
        };
      }
      return item; // Do not modify other sizes
    });

    const cartItem = {
      ...restData,
      stock: updatedStock,
      size: size,
      qty: qty,
      isSelected: true
    };

    dispatch({
      type: "addToCart",
      payload: [...cart, cartItem],
    });

    localStorage.setItem("cartItems", JSON.stringify([...cart, cartItem]));
  }

  return restData; // Return restData instead of cartItem
};




// remove from cart
export const removeFromCart = (data) => async (dispatch, getState) => {
  dispatch({
    type: "removeFromCart",
    payload: data._id,
  });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
  return data;
};

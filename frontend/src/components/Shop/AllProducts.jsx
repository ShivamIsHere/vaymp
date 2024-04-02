import React, { useEffect, useState } from "react";
import { Button, FormControl, MenuItem, Select } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop, deleteProduct ,updateProductStock} from "../../redux/actions/product";
import Loader from "../Layout/Loader";

const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch, seller._id]);

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    window.location.reload();
  };

  const [selectedSize, setSelectedSize] = useState({});
  const [selectedQuantity, setSelectedQuantity] = useState({});

  const handleSizeChange = (productId, size) => {
    setSelectedSize((prevSize) => ({ ...prevSize, [productId]: size }));
    const product = products.find((item) => item._id === productId);
    if (product && product.stock && product.stock.length > 0) {
      const stockItem = product.stock.find((stock) => stock.size === size);
      setSelectedQuantity((prevQuantity) => ({
        ...prevQuantity,
        [productId]: stockItem ? stockItem.quantity : 0,
      }));
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    setSelectedQuantity((prevQuantity) => ({
      ...prevQuantity,
      [productId]: quantity,
    }));
  };

  const handleQuantityIncrement = (productId) => {
    setSelectedQuantity((prevQuantity) => ({
      ...prevQuantity,
      [productId]: (prevQuantity[productId] || 0) + 1,
    }));
  };

  const handleQuantityDecrement = (productId) => {
    const currentQuantity = selectedQuantity[productId] || 0;
    if (currentQuantity > 0) {
      setSelectedQuantity((prevQuantity) => ({
        ...prevQuantity,
        [productId]: currentQuantity - 1,
      }));
    }
  };

  const handleUpdate = async (productId) => {
    const quantityToUpdate = selectedQuantity[productId];
    const sizeToUpdate = selectedSize[productId];
    
    if (quantityToUpdate !== undefined && sizeToUpdate) {
      try {
        await dispatch(updateProductStock(productId, sizeToUpdate, quantityToUpdate));
        console.log(`Successfully updated quantity for size ${sizeToUpdate} of product ${productId}`);
      } catch (error) {
        console.error(`Error updating quantity for size ${sizeToUpdate} of product ${productId}:`, error);
      }
    } else {
      console.error(`Quantity or size for product ${productId} is missing.`);
    }
  };
  

  const columns = [
    { field: "image", headerName: "Product Image", minWidth: 180, flex: 0.7,
    renderCell: (params) => {
      return (
        <Link to={`/product/${params.id}`}>
          <img src={params.value} alt="Product" style={{ width: 50, height: 50 }} />
        </Link>
      );
    }
  },
    { field: "name", headerName: "Name", minWidth: 180, flex: 1.4 ,
    renderCell: (params) => {
      return (
        <Link to={`/product/${params.id}`}>
          {params.value}
        </Link>
      );
    }
  },
    { field: "price", headerName: "Price", minWidth: 100, flex: 0.6 },
    {
      field: "size",
      headerName: "Size",
      minWidth: 120,
      flex: 0.6,
      renderCell: (params) => (
        <FormControl variant="outlined" size="small" fullWidth>
          <Select
  value={selectedSize[params.row.id] || ""}
  onChange={(e) => handleSizeChange(params.row.id, e.target.value)}
>
  {params.row.stock.map((stockItem, index) => (
    <MenuItem key={`${stockItem.size}-${index}`} value={stockItem.size}>
      {stockItem.size}
    </MenuItem>
  ))}
</Select>

        </FormControl>
      ),
    },
    {
      field: "quantity",
      headerName: "Quantity",
      minWidth: 450,
      flex: 0.8,
      renderCell: (params) => (
        <div className="flex items-center">
          <Button
            className="quantity-button"
            onClick={() => handleQuantityDecrement(params.row.productId)}
            disabled={selectedQuantity[params.row.productId] === 0}
          >
            -
          </Button>
          <FormControl variant="outlined" size="small">
            <input
              type="number"
              value={selectedQuantity[params.row.productId] || ""}
              onChange={(e) =>
                handleQuantityChange(params.row.productId, e.target.value)
              }
            />
          </FormControl>
          <Button
            className="quantity-button"
            onClick={() => handleQuantityIncrement(params.row.productId)}
          >
            +
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleUpdate(params.row.productId)}
          >
            Update
          </Button>
        </div>
      ),
    },

    { field: "sold", headerName: "Sold out", type: "number", minWidth: 130, flex: 0.6 },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/product/${params.id}`}>
            <Button>
              <AiOutlineEye size={20} />
            </Button>
          </Link>
      ),
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.id)}>
            <AiOutlineDelete size={20} />
          </Button>
      ),
    },
  ];

  const row = products
  ? products.flatMap((item) =>
      item.stock.map((stockItem, index) => ({
        id: `${item._id}`, // Use size as part of the ID to ensure uniqueness
        image: item.images && item.images[0]?.url, // Assuming item.images is an array of image objects

        productId: item._id,
        name: item.name,
        price: "Rs. " + item.discountPrice,
        size: stockItem.size,
        quantity: stockItem.quantity,
        sold: item?.sold_out,
        stock: item.stock,
      }))
    )
  : [];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}
    </>
  );
};

export default AllProducts;



// import React, { useEffect, useState } from "react";
// import { Button, FormControl, MenuItem, Select } from "@material-ui/core";
// import { DataGrid } from "@material-ui/data-grid";
// import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { getAllProductsShop } from "../../redux/actions/product";
// import { deleteProduct } from "../../redux/actions/product";
// import Loader from "../Layout/Loader";

// const AllProducts = () => {
//   const { products, isLoading } = useSelector((state) => state.products);
//   const { seller } = useSelector((state) => state.seller);

//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(getAllProductsShop(seller._id));
//   }, [dispatch, seller._id]);

//   const [selectedSize, setSelectedSize] = useState({});
//   const [selectedQuantity, setSelectedQuantity] = useState({});

//   const handleSizeChange = (productId, size) => {
//     setSelectedSize((prevSize) => ({ ...prevSize, [productId]: size }));
//   };

//   const handleQuantityChange = (productId, quantity) => {
//     setSelectedQuantity((prevQuantity) => ({ ...prevQuantity, [productId]: quantity }));
//   };

//   const handleDelete = (id) => {
//     dispatch(deleteProduct(id));
//     window.location.reload();
//   };

//   const handleIncrementQuantity = (productId) => {
//     setSelectedQuantity((prevQuantity) => ({
//       ...prevQuantity,
//       [productId]: (prevQuantity[productId] || 0) + 1,
//     }));
//   };

//   const handleDecrementQuantity = (productId) => {
//     setSelectedQuantity((prevQuantity) => ({
//       ...prevQuantity,
//       [productId]: Math.max((prevQuantity[productId] || 0) - 1, 0),
//     }));
//   };

//   const columns = [
//     { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
//     {
//       field: "name",
//       headerName: "Name",
//       minWidth: 180,
//       flex: 1.4,
//     },
//     {
//       field: "price",
//       headerName: "Price",
//       minWidth: 100,
//       flex: 0.6,
//     },
//     {
//       field: "size",
//       headerName: "Size",
//       minWidth: 120,
//       flex: 0.6,
//       renderCell: (params) => (
//         <FormControl variant="outlined" size="small" fullWidth>
//           <Select
//             value={selectedSize[params.id] || ""}
//             onChange={(e) => handleSizeChange(params.id, e.target.value)}
//           >
//             {params.row.stock.map((stockItem) => (
//               <MenuItem key={stockItem.size} value={stockItem.size}>
//                 {stockItem.size}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       ),
//     },
//     {
//       field: "quantity",
//       headerName: "Quantity",
//       minWidth: 150,
//       flex: 0.8,
//       renderCell: (params) => (
//         <div className="flex items-center">
//           <Button onClick={() => handleDecrementQuantity(params.id)} disabled={selectedQuantity[params.id] <= 0}>
//             -
//           </Button>
//           <span className="mx-2">{selectedQuantity[params.id] || 0}</span>
//           <Button onClick={() => handleIncrementQuantity(params.id)}>+</Button>
//         </div>
//       ),
//     },


//     {
//       field: "sold",
//       headerName: "Sold out",
//       type: "number",
//       minWidth: 130,
//       flex: 0.6,
//     },
//     {
//       field: "Preview",
//       flex: 0.8,
//       minWidth: 100,
//       headerName: "",
//       type: "number",
//       sortable: false,
//       renderCell: (params) => {
//         return (
//           <>
//             <Link to={`/product/${params.id}`}>
//               <Button>
//                 <AiOutlineEye size={20} />
//               </Button>
//             </Link>
//           </>
//         );
//       },
//     },
//     {
//       field: "Delete",
//       flex: 0.8,
//       minWidth: 120,
//       headerName: "",
//       type: "number",
//       sortable: false,
//       renderCell: (params) => {
//         return (
//           <>
//             <Button onClick={() => handleDelete(params.id)}>
//               <AiOutlineDelete size={20} />
//             </Button>
//           </>
//         );
//       },
//     },
//   ];

//   const row = [];

//   products &&
//     products.forEach((item) => {
//       row.push({
//         id: item._id,
//         name: item.name,
//         price: "US$ " + item.discountPrice,
//         // size: selectedSize[item._id] || "",
//         // quantity: selectedQuantity[item._id] || "",
//         size:item._id,
//         quantity:item._id,
//         sold: item?.sold_out,
//       });
//     });

//   return (
//     <>
//       {isLoading ? (
//         <Loader />
//       ) : (
//         <div className="w-full mx-8 pt-1 mt-10 bg-white">
//           <DataGrid
//             rows={row}
//             columns={columns}
//             pageSize={10}
//             disableSelectionOnClick
//             autoHeight
//           />
//         </div>
//       )}
//     </>
//   );
// };
// export default AllProducts;

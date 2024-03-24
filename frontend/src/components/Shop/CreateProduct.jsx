import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [sizesAndQuantities, setSizesAndQuantities] = useState([{ size: "", quantity: 0 }]);

  const sizes = [
    '2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL',
    '0 - 1 Month', '1 - 2 Months', '2 - 3 Months', '3 - 4 Months', '4 - 5 Months', '5 - 6 Months', 
    '6 - 7 Months', '7 - 8 Months', '8 - 9 Months', '9 - 10 Months', '10 - 11 Months', '11 - 12 Months', 
    '1 - 2 Years', '2 - 3 Years', '3 - 4 Years', '4 - 5 Years', '5 - 6 Years', '6 - 7 Years', '7 - 8 Years', 
    '8 - 9 Years', '9 - 10 Years', '10 - 11 Years', '11 - 12 Years', '12 - 13 Years', '13 - 14 Years', 
    '14 - 15 Years', '15 - 16 Years'
  ];  

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Product created successfully!");
      window.location.reload();
    }
  }, [dispatch, error, success]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddSizeQuantity = () => {
    setSizesAndQuantities([...sizesAndQuantities, { size: "", quantity: 0 }]);
  };

  const handleRemoveSizeQuantity = (index) => {
    const updatedSizesAndQuantities = [...sizesAndQuantities];
    updatedSizesAndQuantities.splice(index, 1);
    setSizesAndQuantities(updatedSizesAndQuantities);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const stockData = sizesAndQuantities.map(({ size, quantity }) => ({ size, quantity }));

    const newForm = new FormData();

    images.forEach((image) => {
      newForm.append("images", image);
    });

    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("category", category);
    newForm.append("tags", tags);
    newForm.append("originalPrice", originalPrice);
    newForm.append("discountPrice", discountPrice);
    newForm.append("shopId", seller._id);

    dispatch(
      createProduct({
        name,
        description,
        category,
        tags,
        originalPrice,
        discountPrice,
        stock: stockData,
        shopId: seller._id,
        images,
      })
    );
  };

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Create Product</h5>
      <form onSubmit={handleSubmit}>
        <br />
        <div>
          <label className="pb-2">Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your product name..."
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Description <span className="text-red-500">*</span></label>
          <textarea
            cols="30"
            required
            rows="8"
            type="text"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your product description..."
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <br />
        <div>
          <label className="pb-2">Category <span className="text-red-500">*</span></label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Choose a category</option>
            {categoriesData.map((i) => (
              <option value={i.title} key={i.title}>
                {i.title}
              </option>
            ))}
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2">Tags</label>
          <input
            type="text"
            name="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter your product tags..."
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />

        </div>
        <br />
        <div>
          <label className="pb-2">Original Price</label>
          <input
              type="number"
              name="price"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="Enter your product price..."
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <br />
          <div>
            <label className="pb-2">
              Price (With Discount) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              placeholder="Enter your product price with discount..."
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <br />
          <div>
            <label className="pb-2">Size and Quantity</label>
            {sizesAndQuantities.map((item, index) => (
              <div key={index} className="flex mt-2">
                <select
                  className="w-1/2 border h-[35px] rounded-[5px] mr-2"
                  value={item.size}
                  onChange={(e) => {
                    const updatedSizesAndQuantities = [...sizesAndQuantities];
                    updatedSizesAndQuantities[index].size = e.target.value;
                    setSizesAndQuantities(updatedSizesAndQuantities);
                  }}
                >
                  <option value="">Select size</option>
                  {sizes.map((size) => (
                    <option value={size} key={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const updatedSizesAndQuantities = [...sizesAndQuantities];
                    updatedSizesAndQuantities[index].quantity = parseInt(e.target.value, 10);
                    setSizesAndQuantities(updatedSizesAndQuantities);
                  }}
                  placeholder="Enter product quantity..."
                  className="w-1/2 border h-[35px] rounded-[5px] mr-2 px-3"
                />
                {index === sizesAndQuantities.length - 1 && (
                  <AiOutlinePlusCircle
                    size={30}
                    className="mt-1 cursor-pointer"
                    color="#555"
                    onClick={handleAddSizeQuantity}
                  />
                )}
                {index !== sizesAndQuantities.length - 1 && (
                  <AiOutlineMinusCircle
                    size={30}
                    className="mt-1 cursor-pointer"
                    color="red"
                    onClick={() => handleRemoveSizeQuantity(index)}
                  />
                )}
              </div>
            ))}
          </div>
          <br />
          <div>
            <input
              type="submit"
              value="Create"
              className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </form>
      </div>
  );
};

export default CreateProduct;


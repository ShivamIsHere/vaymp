import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";
import { createevent } from "../../redux/actions/event";
import { Circles } from "react-loader-spinner";
import { useParams } from "react-router-dom";

const CreateEvent = () => {
  // const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.events);
  const {id}=useParams()
  const seller=id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [sizesAndQuantities, setSizesAndQuantities] = useState([
    { size: "", quantity: 0 }
  ]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const sizes = [
    "2XS",
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "2XL",
    "3XL",
    "4XL",
    "5XL",
    "6XL",
    "7XL",
    "8XL",
    "0 - 1 Month",
    "1 - 2 Months",
    "2 - 3 Months",
    "3 - 4 Months",
    "4 - 5 Months",
    "5 - 6 Months",
    "6 - 7 Months",
    "7 - 8 Months",
    "8 - 9 Months",
    "9 - 10 Months",
    "10 - 11 Months",
    "11 - 12 Months",
    "1 - 2 Years",
    "2 - 3 Years",
    "3 - 4 Years",
    "4 - 5 Years",
    "5 - 6 Years",
    "6 - 7 Years",
    "7 - 8 Years",
    "8 - 9 Years",
    "9 - 10 Years",
    "10 - 11 Years",
    "11 - 12 Years",
    "12 - 13 Years",
    "13 - 14 Years",
    "14 - 15 Years",
    "15 - 16 Years"
  ];
  const handleStartDateChange = (e) => {
    const startDate = new Date(e.target.value);
    const minEndDate = new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    setStartDate(startDate);
    document.getElementById("start-date").min = startDate.toISOString().slice(
      0,
      10
    );
    document.getElementById("end-date").min = minEndDate.toISOString().slice(
      0,
      10
    );
  };

  const handleEndDateChange = (e) => {
    const endDate = new Date(e.target.value);
    setEndDate(endDate);
  };

  const today = new Date().toISOString().slice(0, 10);

  const minEndDate = startDate
    ? new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10)
    : "";

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Event created successfully!",{
        autoClose:5000000  })   
        navigate("/admin-events");
        // navigate("/admin-sellers");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newForm = new FormData();
    const stockData = sizesAndQuantities.map(({ size, quantity }) => ({
      size,
      quantity
    }));

    images.forEach((image) => {
      newForm.append("images", image);
    });
    const data = {
      name,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock: stockData,
      shopId: seller,
      images,
      start_Date: startDate?.toISOString(),
      Finish_Date: endDate?.toISOString()
    };
    console.log("sdflllsd")
    try {
      await dispatch(createevent(data));
      toast.success("Event created successfully!");
      // navigate("/dashboard-events");
      window.location.reload();
      console.log("sdfsd")
      setLoading(false);
    } catch (error) {
      // Handle error
      console.log("ffff",error)
      setLoading(false);
    }  };

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white  shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Create Event</h5>
      {/* create event form */}
      <form onSubmit={handleSubmit}>
        <br />
        <div>
          <label className="pb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your event product name..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            required
            rows="8"
            type="text"
            name="description"
            value={description}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your event product description..."
          ></textarea>
        </div>
        <br />
        <div>
          <label className="pb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Choose a category">Choose a category</option>
            {categoriesData &&
              categoriesData.map((i) => (
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
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter your event product tags..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Original Price</label>
          <input
            type="number"
            name="price"
            value={originalPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="Enter your event product price..."
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
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDiscountPrice(e.target.value)}
            placeholder="Enter your event product price with discount..."
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
                  updatedSizesAndQuantities[index].quantity = parseInt(
                    e.target.value,
                    10
                  );
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
          <label className="pb-2">
            Event Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="price"
            id="start-date"
            value={startDate ? startDate.toISOString().slice(0, 10) : ""}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleStartDateChange}
            min={today}
            placeholder="Enter your event product stock..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Event End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="price"
            id="end-date"
            value={endDate ? endDate.toISOString().slice(0, 10) : ""}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleEndDateChange}
            min={minEndDate}
            placeholder="Enter your event product stock..."
          />
        </div>
        <br />

        <div>
          <label className="pb-2">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name=""
            id="upload"
            className="hidden"
            multiple
            onChange={handleImageChange}
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
            {images &&
              images.map((i) => (
                <img
                  src={i}
                  key={i}
                  alt=""
                  className="h-[120px] w-[120px] object-cover m-2"
                />
              ))}
          </div>
          <br />
          <div>
          {loading ? (
                <div style={{ width: "100%", display: "flex",justifyContent:"center",alignItems:"center" }}>
                  <Circles
                      height={50}
                      width={50}
                      color="cyan"
                      ariaLabel="circles-loading"
                    />
                    </div>
              ) : (
            <input
              type="submit"
              value="Create"
              className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />)}
              </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;

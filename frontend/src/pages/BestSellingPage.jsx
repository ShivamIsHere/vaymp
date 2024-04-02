import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import Footer from "../components/Layout/Footer";

const BestSellingPage = () => {
  const [data, setData] = useState([]);
  const {allProducts,isLoading} = useSelector((state) => state.products);

  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData?.sort((a,b) => b.sold_out - a.sold_out); 
    setData(sortedData);
  }, [allProducts]);

  return (
    <>
    {isLoading ? (
      <Loader />
    ) : (
      <div>
        <Header activeHeading={2} />
        <br />
        <br />
        <div className={`${styles.section}`}>
          <div className="grid grid-cols-2 gap-[20px] md:gap-[25px] lg:gap-[25px] xl:gap-[30px] mb-12">
            {data && data.map((i, index) => <ProductCard data={i} key={index} />)}
          </div>
        </div>
        <Footer />
        </div>
    )}
    </>
  );
};

export default BestSellingPage;

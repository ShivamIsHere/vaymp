import React, { useEffect, useState } from "react";
import Footer from "../../components/Layout/Footer";
import Header from "../../components/Layout/Header";
import ShopCard from "../../components/ShopCard/ShopCard";


const ShopsPage = () => {
    return (
        <>
        <Header/>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Our Shops</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ShopCard shopName="Shop 1" image="https://via.placeholder.com/300" />
          <ShopCard shopName="Shop 2" image="https://via.placeholder.com/300" />
          <ShopCard shopName="Shop 3" image="https://via.placeholder.com/300" />
          <ShopCard shopName="Shop 4" image="https://via.placeholder.com/300" />
        </div>
      </div>
      <Footer/>
      </>
    );
  };

  export default ShopsPage;
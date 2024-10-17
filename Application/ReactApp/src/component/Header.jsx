// Header.js
import React from "react";
import logo from "../assets/logo.png";
import useProductStore from "../store/store";
import lang from "../assets/lang.png";

export default function Header() {
  const {
    search,
    products,
    updateSearchAndProducts,
    getTheProductInSearch,
  } = useProductStore();

  return (
    <header className="w-full bg-white flex justify-between items-center px-14">
      <img src={logo} alt="logo" className="h-3/5" />
      <div className="h-full flex justify-center items-center gap-9 relative">
        <button className="h-full">
          <img src={lang} alt="language" className="h-1/4" />
        </button>
        <input
          type="text"
          onChange={(e) => updateSearchAndProducts(e.target.value)}
          name="Search"
          value={search}
          className="h-3/5 w-80 p-5 border-gray-300 border-2 rounded-3xl text-right"
          placeholder="بحث"
        />
        {/* قائمة نتائج البحث */}
        {search && products.length > 0 && (
          <div className="absolute bg-white top-20 w-80 right-0 max-h-96 overflow-y-auto text-gray-900 rounded-3xl p-4 border-2 border-gray-400 z-10">
            {products.map((product) => (
              <div
                className="py-2 cursor-pointer"
                key={product._id}
                onClick={() => getTheProductInSearch(product._id)}
              >
                <div className="flex flex-row-reverse justify-between items-center">
                  <hgroup>
                    <h4 className="text-right">{product.Name}</h4>
                    <p className="text-gray-500 text-right">
                      {product.Description}
                    </p>
                  </hgroup>
                  <p>{product.Price}</p>
                </div>
                <hr className="border-gray-300 my-2" />
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
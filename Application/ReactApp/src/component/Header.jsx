// Header.js
import React, { useRef, useEffect } from "react";
import logo from "../assets/logo.png";
import useProductStore from "../store/store";
import lang from "../assets/lang.png";

export default function Header() {
  const { search, products, updateSearchAndProducts, getTheProductInSearch } =
    useProductStore();
  const searchRef = useRef(null);

  useEffect(() => {
    searchRef.current.focus(); // Auto-focus when the component mounts
  }, []);

  // تحديث البحث وإضافة المنتج إذا تم العثور على تطابق في الرقم الشريطي
  const handleSearchChange = (e) => {
    const value = e.target.value;
    updateSearchAndProducts(value); // تحديث البحث

    // البحث عن منتج يطابق الرقم الشريطي فقط
    const matchedProduct = products.find(
      (product) => product.Barcode === value
    );

    // إذا تم العثور على منتج مطابق، يتم اختياره تلقائيًا
    if (matchedProduct) {
      getTheProductInSearch(matchedProduct._id);
    }
  };

  return (
    <header className="w-full bg-white flex justify-between items-center px-14">
      <img src={logo} alt="logo" className="h-3/5" />
      <div className="h-full flex justify-center items-center gap-9 relative">
        <button className="h-full">
          <img src={lang} alt="language" className="h-1/4" />
        </button>

        <input
          type="text"
          onChange={handleSearchChange}
          name="Search"
          ref={searchRef}
          value={search}
          className="h-3/5 w-80 p-5 border-gray-300 border-2 rounded-3xl text-right"
          placeholder="بحث بالرقم الشريطي"
        />

        {search && products.length > 0 && (
          <div className="absolute bg-white top-20 w-80 right-0 max-h-96 overflow-y-auto text-gray-900 rounded-3xl p-4 border-2 border-gray-400 z-10">
            {products.map((product) => (
              <div
                className="py-2 cursor-pointer"
                key={product._id}
                onClick={() => getTheProductInSearch(product._id)}
              >
                <button className="flex flex-row-reverse justify-between items-center">
                  <hgroup>
                    <h4 className="text-right">{product.Name}</h4>
                    <p className="text-gray-500 text-right">
                      {product.Description}
                    </p>
                  </hgroup>
                  <p>{product.Price}</p>
                </button>
                <hr className="border-gray-300 my-2" />
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

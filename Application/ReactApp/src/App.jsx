// App.js
import React, { useEffect, useState } from "react";
import Header from "./component/Header";
import useProductStore from "./store/store";
import contact from "./assets/Iqons/contact.png";
import profile from "./assets/Iqons/profile.png";
import "./index.css";
import Swal from "sweetalert2";

export default function App() {
  const [quantities, setQuantities] = useState({}); // State for quantities of each product
  const [totalPrice, setTotalPrice] = useState(0); // State for total price
  const { fetchData, selectedProducts, removeProductFromSelected } =
    useProductStore();

  useEffect(() => {
    fetchData();
  }, []);

  // Function to update quantity for a specific product
  const updateQuantity = (productId, num, price) => {
    setQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[productId] || 1; // Get current quantity or default to 0
      const newQuantity = currentQuantity + num;

      if (newQuantity < 0) return prevQuantities; // Prevent negative quantity

      const updatedQuantities = { ...prevQuantities, [productId]: newQuantity };
      calculateTotalPrice(updatedQuantities); // Update total price
      return updatedQuantities;
    });
  };

  // Function to calculate total price based on quantities
  useEffect(() => {
    const calculateTotalPrice = (quantities) => {
      const newTotalPrice = selectedProducts.reduce((total, product) => {
        const quantity = quantities[product._id] || 0; // Get quantity for the product
        return total + product.Price * quantity; // Calculate total price
      }, 0);
      setTotalPrice(newTotalPrice);
    };
  }, []);

  const Save = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "تم الحفظ بنجاح",
      showConfirmButton: false,
      timer: 1000,
    });
    setselectedProducts([]);
  };
  // Modified removeProductFromSelected function
  const handleRemoveProduct = (productId) => {
    const { selectedProducts } = useProductStore.getState(); // Get current state
    const productToRemove = selectedProducts.find(
      (product) => product._id === productId
    );

    // Remove the product
    removeProductFromSelected(productId);

    // Recalculate total price
    if (productToRemove) {
      const updatedQuantities = { ...quantities };
      delete updatedQuantities[productId]; // Remove the quantity for the deleted product
      calculateTotalPrice(updatedQuantities); // Update total price
      setQuantities(updatedQuantities); // Update quantities state
    }
  };

  return (
    <>
      <Header />
      <main className="flex justify-start flex-row-reverse">
        <section className="bg-white w-1/6 flex flex-col justify-between px-6 py-5">
          <div className="flex flex-col w-full text-right gap-6">
            <hgroup>
              <h3 className="text-3xl flex items-end flex-row-reverse custom-Color">
                <span className="icon-[hugeicons--cashier]"></span>
                الكاشير
              </h3>
            </hgroup>
            <hgroup className="flex flex-col gap-3">
              <h3 className="text-3xl custom-Color2 flex items-end justify-end text-right">
                المخزون
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 48 48"
                >
                  <g fill="currentColor">
                    <path d="M27.707 7.707a1 1 0 0 0-1.414-1.414L24 8.586l-2.293-2.293a1 1 0 1 0-1.414 1.414L22.586 10l-2.293 2.293a1 1 0 0 0 1.414 1.414L24 11.414l2.293 2.293a1 1 0 1 0 1.414-1.415L25.414 10zm6.242 24.477a1 1 0 0 1-.633 1.265l-4.5 1.5a1 1 0 0 1-.632-1.898l4.5-1.5a1 1 0 0 1 1.265.633"></path>
                    <path
                      fillRule="evenodd"
                      d="M6.684 26.449L10 27.554V36a1 1 0 0 0 .673.945l12.992 4.497a1 1 0 0 0 .637.011l.014-.004l.015-.005l12.996-4.499A1 1 0 0 0 38 36v-8.446l3.316-1.105a1 1 0 0 0 .465-1.574l-4-5a1 1 0 0 0-.456-.32l-12.998-4.5a1 1 0 0 0-.654 0l-12.998 4.5a1 1 0 0 0-.456.32l-4 5a1 1 0 0 0 .465 1.574m14.635 4.124l1.681-2.4v10.923l-11-3.808V28.22l8.184 2.728a1 1 0 0 0 1.135-.376M14.057 20.5L24 23.942l9.943-3.442L24 17.058zm12.624 10.074L25 28.172v10.924l11-3.808V28.22l-8.184 2.728a1 1 0 0 1-1.135-.376M11.34 21.676l-2.663 3.329l5.511 1.837l5.92 1.973l2.313-3.303l-.135-.047zm27.983 3.329l-2.663-3.33l-11.081 3.837l2.313 3.303z"
                      clipRule="evenodd"
                    ></path>
                  </g>
                </svg>
              </h3>
              <ol className="list-disc px-9 flex flex-col gap-3">
                <li>المخزون المتوفر</li>
                <li>المخزون غير المتوفر</li>
              </ol>
            </hgroup>
            <hgroup>
              <h3 className="text-3xl custom-Color2 flex items-end justify-end text-right">
                التقارير
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3h14v18l-1.032-.884a2 2 0 0 0-2.603 0L14.333 21l-1.031-.884a2 2 0 0 0-2.604 0L9.667 21l-1.032-.884a2 2 0 0 0-2.603 0L5 21zm10 4H9m6 4H9m6 4h-4"
                  ></path>
                </svg>
              </h3>
            </hgroup>
          </div>
          <div className="w-full h-20 flex items-center justify-between border-black border-t-2 p-5">
            <img src={contact} className="h-9" alt="contact" />
            <img src={profile} className="h-9" alt="profile" />
          </div>
        </section>
        <section className="w-4/6 border-l-2 border-r-2 border-t-2">
          <ul className="w-full bg-white h-full">
            <li className="w-full h-24 flex justify-center items-center">
              <p className="w-1/4 text-center">الكمية المتاحة</p>
              <hr className="border-2 border-gray-400 rounded-lg h-14" />
              <p className="w-1/4 text-center">اسم المنتج</p>
              <hr className="border-2 border-gray-400 rounded-lg h-14" />
              <p className="w-1/4 text-center">السعر</p>
              <hr className="border-2 border-gray-400 rounded-lg h-14" />
              <p className="w-1/4 text-center">الرمز الشريطي</p>
            </li>
            {/* عرض قائمة المنتجات المختارة */}
            {selectedProducts.map((product) => (
              <li
                key={product._id}
                className="w-full h-24 flex justify-center items-center relative"
              >
                <p className="w-1/4 text-center">{product.Stock}</p>
                <hr className="border-2 border-gray-400 rounded-lg h-14" />
                <p className="w-1/4 text-center">{product.Name}</p>
                <hr className="border-2 border-gray-400 rounded-lg h-14" />
                <p className="w-1/4 text-center">{product.Price}</p>
                <hr className="border-2 border-gray-400 rounded-lg h-14" />
                <p className="w-1/4 text-center">{product.Barcode}</p>
                <p className="absolute right-20">
                  {quantities[product._id] || 0}
                </p>
                <div className="w-10 h-10 absolute flex justify-center flex-col right-8">
                  <button
                    className="costom-color3 right-5 transition-all"
                    onClick={() =>
                      updateQuantity(product._id, 1, product.Price)
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                    >
                      <g fill="none" fillRule="evenodd">
                        <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
                        <path
                          fill="currentColor"
                          d="M10.94 7.94a1.5 1.5 0 0 1 2.12 0l5.658 5.656a1.5 1.5 0 1 1-2.122 2.121L12 11.122l-4.596 4.596a1.5 1.5 0 1 1-2.122-2.12z"
                        ></path>
                      </g>
                    </svg>
                  </button>
                  <button
                    className="costom-color3 right-5 transition-all"
                    onClick={() =>
                      updateQuantity(product._id, -1, product.Price)
                    }
                  >
                    <svg
                      className="rotate-180"
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                    >
                      <g fill="none" fillRule="evenodd">
                        <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
                        <path
                          fill="currentColor"
                          d="M10.94 7.94a1.5 1.5 0 0 1 2.12 0l5.658 5.656a1.5 1.5 0 1 1-2.122 2.121L12 11.122l-4.596 4.596a1.5 1.5 0 1 1-2.122-2.12z"
                        ></path>
                      </g>
                    </svg>
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveProduct(product._id)}
                  className="text-red-500 hover:text-black absolute right-5 transition-all"
                >
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"
                    ></path>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section className="w-1/6 bg-white flex flex-col justify-between items-center pt-10 border-t-2 ">
          <h3 className="custom-Color2 text-2xl">الفاتورة</h3>
          <div className="custom-Color4 w-full h-72 flex flex-col items-center justify-between py-6 ">
            <p className="w-full px-10 text-right text-1xl">
              السعر : {(totalPrice * 0.85).toFixed(3)} ﷼
            </p>
            <p className="w-full px-10 text-right text-1xl">
              الضريبة: {(totalPrice.toFixed(4) * 0.15).toFixed(3)} ﷼
            </p>
            <h3 className="w-full px-10 text-right text-2xl">
              المجموع: {totalPrice.toFixed(2)} ﷼
            </h3>
            <div className="w-5/6 h-20 flex justify-evenly gradient rounded-2xl items-center">
              <button
                className="w-28 h-1/2 rounded-lg flex justify-center items-center bg-white"
                onClick={Save}
              >
                حفظ الفاتورة
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 48 48"
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth={4}
                  >
                    <path d="M6 9a3 3 0 0 1 3-3h21.336a3 3 0 0 1 2.122.879l3.858 3.858l4.805 4.805A3 3 0 0 1 42 17.664V39a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z"></path>
                    <path d="M31 26H17a3 3 0 0 0-3 3v13h20V29a3 3 0 0 0-3-3Z"></path>
                    <path
                      strokeLinecap="round"
                      d="M29 16H17a3 3 0 0 1-3-3V6"
                    ></path>
                  </g>
                </svg>
              </button>
              <button className="w-28 h-1/2 rounded-lg flex justify-center items-center bg-white">
                طباعة الفاتورة
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 3h14v18l-1.032-.884a2 2 0 0 0-2.603 0L14.333 21l-1.031-.884a2 2 0 0 0-2.604 0L9.667 21l-1.032-.884a2 2 0 0 0-2.603 0L5 21zm10 4H9m6 4H9m6 4h-4"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

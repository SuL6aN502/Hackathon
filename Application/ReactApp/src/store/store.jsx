// store.js
import { create } from "zustand";
import axios from "axios";

const useProductStore = create((set, get) => ({
  // الحالات (states)
  products: [],
  search: "",
  searchProduct: {
    Barcode: "",
    Category: "",
    CreatedAt: "",
    Description: "",
    Name: "",
    Price: "",
    Stock: "",
    expirationDate: "",
    reorderLevel: 0,
    id: "",
  },
  selectedProducts: [],
  createProd: {
    Name: "",
    Description: "",
    Barcode: "",
    Price: 0,
    Stock: 0,
    Category: "",
    expirationDate: "",
    CreatedAt: "",
  },
  updateProduct: {
    _id: "",
    Name: "",
    Description: "",
    Barcode: "",
    Price: 0,
    Stock: 0,
    Category: "",
    expirationDate: "",
    CreatedAt: "",
  },
  showForm: false,
  showUpdateProduct: false,
  updateTarget: null,

  // الدوال (actions)

  // دالة للحصول على تفاصيل منتج من البحث وإضافته إلى القائمة
  getTheProductInSearch: async (id) => {
    try {
      const informtionsOfProduct = await axios.get(
        `http://localhost:4000/products/${id}`
      );
      const product = informtionsOfProduct.data.Product;

      set((state) => {
        const isProductAlreadySelected = state.selectedProducts.some(
          (p) => p._id === product._id
        );
        set({ search: "" });

        if (!isProductAlreadySelected) {
          return {
            selectedProducts: [...state.selectedProducts, product],
          };
        }
        return state;
      });
    } catch (err) {
      console.log("can't find the product, the error is" + err);
    }
  },
  // دالة لتحديث قيمة البحث وتحديث المنتجات
  updateSearchAndProducts: async (value) => {
    set({ search: value });
    if (value && value !== "") {
      await get().SearchFunc(value);
    } else {
      set({ products: [] });
    }
  },

  // دالة للبحث
  SearchFunc: async (searchKey) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/products/search/${searchKey}`
      );
      // قم بتحديث حالة المنتجات بالنتائج
      set({ products: response.data });
    } catch (error) {
      console.log("Error on searching data: " + error);
    }
  },

  // دالة لتحديث حالة المنتج الذي تم البحث عنه
  setSearchProduct: (product) => set({ searchProduct: product }),

  setCreateProd: (name, value) =>
    set((state) => ({
      createProd: {
        ...state.createProd,
        [name]: value,
      },
    })),

  removeProductFromSelected: (productId) => {
    const { selectedProducts } = get();
    const updatedProducts = selectedProducts.filter(
      (product) => product._id !== productId
    );
    set({ selectedProducts: updatedProducts });
  },

  setUpdateProduct: (name, value) =>
    set((state) => ({
      updateProduct: {
        ...state.updateProduct,
        [name]: value,
      },
    })),

  setShowForm: (value) => set({ showForm: value }),
  setShowUpdateProduct: (value) => set({ showUpdateProduct: value }),
  setUpdateTarget: (value) => set({ updateTarget: value }),

  // دالة لجلب البيانات
  fetchData: async () => {
    try {
      const product = await axios.get("http://localhost:4000/products");
      set({ products: product.data.Products });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },

  setProducts: (products) => set({ products }),

  // دالة لحذف منتج
  deleteProduct: async (id) => {
    try {
      await axios.delete(`http://localhost:4000/products/${id}`);
      // بعد الحذف، قم بتحديث البيانات
      get().fetchData();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  },

  // دالة لإنشاء منتج
  createProduct: async (e) => {
    e.preventDefault();
    try {
      const { createProd } = get();
      await axios.post("http://localhost:4000/products", createProd);
      // بعد الإنشاء، قم بتحديث البيانات
      get().fetchData();
      // إعادة تعيين createProd إلى القيم الافتراضية
      set({
        createProd: {
          Name: "",
          Description: "",
          Barcode: "",
          Price: 0,
          Stock: 0,
          Category: "",
          expirationDate: "",
          CreatedAt: "",
        },
      });
    } catch (error) {
      console.error("Error creating product:", error);
    }
  },

  // دالة لتحديث منتج
  updateProductData: async (e, id) => {
    e.preventDefault();
    try {
      const { updateProduct } = get();
      await axios.put(`http://localhost:4000/products/${id}`, updateProduct);
      set({ updateTarget: null });
      // بعد التحديث، قم بتحديث البيانات
      get().fetchData();
      // إعادة تعيين updateProduct إلى القيم الافتراضية
      set({
        updateProduct: {
          _id: "",
          Name: "",
          Description: "",
          Barcode: "",
          Price: 0,
          Stock: 0,
          Category: "",
          expirationDate: "",
          CreatedAt: "",
        },
      });
    } catch (error) {
      console.error("Error updating product:", error);
    }
  },
}));

export default useProductStore;

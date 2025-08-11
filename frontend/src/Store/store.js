import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice/index.js";

import adminProductSlice from "./Admin/ProductSlice/index.js"

import shopProductSlice from "./Shop/ProductsSlice/index.js"

import shopCartSlice from "./Shop/CartSlice/index.js"

import shopAddressSlice from "./Shop/AddressSlice/index.js"

import customerProfileSlice from "./CustomerProfile/index.js"
// import shopAddressSlice from "./Shop/AddressSlice/index.js"
import packageReducer from "./Package/packageSlice.js";

import userSlice from "./Admin/User/userSlice.js";

import employeeSlice from "./Admin/User/userSlice copy.js"

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminproducts: adminProductSlice,
    shopproducts: shopProductSlice,
    shopcart: shopCartSlice,
    shopaddress: shopAddressSlice,
    packages: packageReducer,
    users:userSlice,
    employees : employeeSlice

  },
});

export default store;

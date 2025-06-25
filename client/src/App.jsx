import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AuthLayout from "./Components/Auth/layout";
import Authlogin from "./Screens/Auth/login";
import Authregister from "./Screens/Auth/register";
import AdminLayout from "./Components/Admin-view/Layout";
import AdminDashBoard from "./Screens/Admin-view/DashBoard";
import AdminFeatures from "./Screens/Admin-view/Features";
import AdminOrders from "./Screens/Admin-view/Orders";
import AdminProducts from "./Screens/Admin-view/Products";
import ShoppingViewLayout from "./Components/Shopping-view/Layout";
import NotFound from "./Screens/NotFound/NotFound";
import ShoppingHome from "./Screens/Shopping-view/Home";
import ShoppingListing from "./Screens/Shopping-view/Listing";
import ShoppingCheckout from "./Screens/Shopping-view/Checkout";
import ShoppingAccount from "./Screens/Shopping-view/Account";
import CheckAuth from "./Components/Common/CheckAuth";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./Store/AuthSlice";


function App() {
  
   const {isAuthenticated , user , isLoading} = useSelector(state => state.auth)



  const dispatch = useDispatch()

  
useEffect(function()
{
    dispatch(checkAuth());
    console.log("Is Auth Check")
},[dispatch])
 


if(isLoading)
{
  return <div>Loading ......</div>
}

  return (
    <div className="flex flex-col overflow-hidden bg-blue">
      <Routes>
        {/* ✅ Auth Routes (Login/Register) */}
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<Authlogin />} />
          <Route path="register" element={<Authregister />} />
        </Route>






        {/* ✅ Admin Routes (Protected) */}
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashBoard />} />
          <Route path="feature" element={<AdminFeatures />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />

        </Route>






        {/* ✅ Shopping Routes (Publicly Accessible) */}
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <ShoppingViewLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingAccount />
            </CheckAuth>
          }/>
        </Route>

        {/* ✅ Not Found Route */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

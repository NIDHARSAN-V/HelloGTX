// import React, { useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Header from "./components/Header";
// import Home from "./pages/Home";
// import Footer from "./components/Footer";
// import DestinationsPage from "./components/DestinationsPage";
// import HotelsPage from "./pages/hotels/HotelsPage";
// import HotelDetailPage from "./pages/hotels/HotelDetailPage";
// import FlightsPage from "./pages/flights/FlightsPage";
// import ProfilePage from "./pages/profile/ProfilePage";
// import PackagesPage from "./pages/pakages/PackagesPage";
// import ItineraryForm from "./pages/ItineraryForm/ItineraryForm";
// import PackageDetailsPage from "./pages/pakages/PackageDetailsPage";
// import AuthLogin from "./pages/auth/AuthLogin";
// import AuthRegister from "./pages/auth/AuthRegister";
// import { checkAuth } from "./Store/AuthSlice";
// import { useDispatch, useSelector } from "react-redux";
// import CheckAuth from "./Common/CheckAuth";

// const RootLayout = () => {
//   const { isAuthenticated, isLoading } = useSelector(state => state.auth);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(checkAuth());
//   }, [dispatch]);

//   if (isLoading) {
//     return <div className="flex items-center justify-center h-screen">Loading...</div>;
//   }

//   return (
//     <Router>
//       <div className="flex min-h-screen flex-col">
//         <Header />
//         <main className="flex-1">
//           <Routes>
//             {/* Public routes that should only be accessible when not authenticated */}
//             <Route path="/login" element={
//               <CheckAuth isAuthenticated={isAuthenticated} requireAuth={false}>
//                 <AuthLogin />
//               </CheckAuth>
//             } />
//             <Route path="/register" element={
//               <CheckAuth isAuthenticated={isAuthenticated} requireAuth={false}>
//                 <AuthRegister />
//               </CheckAuth>
//             } />

//             {/* Only completely public route */}
//             <Route path="/" element={<Home />} />

//             {/* All other routes are protected */}
//             <Route path="/destinations" element={
//               <CheckAuth isAuthenticated={isAuthenticated} requireAuth={true}>
//                 <DestinationsPage />
//               </CheckAuth>
//             } />
//             <Route path="/hotels" element={
//               <CheckAuth isAuthenticated={isAuthenticated} requireAuth={true}>
//                 <HotelsPage />
//               </CheckAuth>
//             } />
//             <Route path="/hotels/:id" element={
//               <CheckAuth isAuthenticated={isAuthenticated} requireAuth={true}>
//                 <HotelDetailPage />
//               </CheckAuth>
//             } />
//             <Route path="/packages/:id" element={
//               <CheckAuth isAuthenticated={isAuthenticated} requireAuth={true}>
//                 <PackageDetailsPage />
//               </CheckAuth>
//             } />
//             <Route path="/flights" element={
//               <CheckAuth isAuthenticated={isAuthenticated} requireAuth={true}>
//                 <FlightsPage />
//               </CheckAuth>
//             } />
//             <Route path="/packages" element={
//               <CheckAuth isAuthenticated={isAuthenticated} requireAuth={true}>
//                 <PackagesPage />
//               </CheckAuth>
//             } />
//             <Route path="/profile" element={
//               <CheckAuth isAuthenticated={isAuthenticated} requireAuth={true}>
//                 <ProfilePage />
//               </CheckAuth>
//             } />
//             <Route path="/itenaryCreation" element={
//               <CheckAuth isAuthenticated={isAuthenticated} requireAuth={true}>
//                 <ItineraryForm />
//               </CheckAuth>
//             } />

//             {/* Fallback route */}
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </main>
//         <Footer />
//       </div>
//     </Router>
//   );
// };

// export default RootLayout;







import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import DestinationsPage from "./components/DestinationsPage";
import HotelsPage from "./pages/hotels/HotelsPage";
import HotelDetailPage from "./pages/hotels/HotelDetailPage";
import FlightsPage from "./pages/flights/FlightsPage";
import ProfilePage from "./pages/profile/ProfilePage";
import PackagesPage from "./pages/pakages/PackagesPage";
import ItineraryForm from "./pages/ItineraryForm/ItineraryForm";
import PackageDetailsPage from "./pages/pakages/PackageDetailsPage";
import AuthLogin from "./pages/auth/AuthLogin";
import AuthRegister from "./pages/auth/AuthRegister";
import { checkAuth } from "./Store/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import CheckAuth from "./Common/CheckAuth";
import NotFound from "./Common/NotFound";
import CustomizePackageForm from "./pages/pakages/CustomizePackageForm";
import UserManagement from "./pages/admin/UserManagement";
import HotelPackageList from "./pages/hotels/HotelPackageList";
import HotelPackageForm from "./pages/hotels/HotelPackageForm";
import HotelPackageDetail from "./pages/hotels/HotelPackageDetail";
import FlightPackageList from "./pages/flights/FlightPackageList";
import FlightPackageForm from "./pages/flights/FlightPackageForm";
import FlightPackageDetail from "./pages/flights/FlightPackageDetail";
import Lead from "./pages/lead/Lead";
import LeadCreation from "./pages/lead/LeadCreation";
import NewQuery from "./pages/lead/NewQuery";

const RootLayout = () => {


  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // console.log(user)

  //user contains role - > customer or employee

  useEffect(() => {

    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            {/* Public routes that should only be accessible when not authenticated */}

            <Route path="/admin" element={<UserManagement />} />

            <Route
              path="/login"
              element={
                <CheckAuth
                  isAuthenticated={isAuthenticated}
                  requireAuth={false}
                >
                  <AuthLogin />
                </CheckAuth>
              }
            />
            <Route
              path="/register"
              element={
                <CheckAuth
                  isAuthenticated={isAuthenticated}
                  requireAuth={false}
                >
                  <AuthRegister />
                </CheckAuth>
              }
            />

            <Route path="/hotel-packages" element={<HotelPackageList />} />
            <Route
              path="/admin/hotel-packages/create"
              element={<HotelPackageForm />}
            />

            <Route
              path="/hotel-packages/details"
              element={<HotelPackageDetail />}
            />


            <Route path="/flight-packages" element={<FlightPackageList />} />
            <Route
              path="/admin/flight-packages/create"
              element={<FlightPackageForm />}
            />

            <Route
              path="/flight-packages/details"
              element={<FlightPackageDetail />}
            />



            {/* Public routes accessible to all */}
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/hotels" element={<HotelsPage />} />
            <Route path="/hotels/:id" element={<HotelDetailPage />} />
            <Route path="/packages/:id" element={<PackageDetailsPage />} />
            <Route
              path="/customize-packages"
              element={<CustomizePackageForm />}
            />
            <Route path="/flights" element={<FlightsPage />} />
            <Route path="/packages" element={<PackagesPage />} />

            <Route path="/leads/query" element={<NewQuery />} />

            {/* Protected routes - only accessible when authenticated */}
            <Route
              path="/profile"
              element={
                <CheckAuth isAuthenticated={isAuthenticated} requireAuth={true}>
                  <ProfilePage />
                </CheckAuth>
              }
            />




            
            <Route
              path="/itenaryCreation"
              element={
                <CheckAuth isAuthenticated={isAuthenticated} requireAuth={true}>
                  <ItineraryForm />
                </CheckAuth>
              }
            />





            <Route path="/lead" element={<Lead/>}/>
            <Route path="/leads/create" element={<LeadCreation/>}/>

            


            {/* Fallback route */}
            <Route path="*" element={<NotFound/>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default RootLayout;

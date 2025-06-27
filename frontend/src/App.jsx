import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import ForgotPassword from "./pages/auth/ForgotPassword";

const RootLayout = () => {
  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthLogin />} />
            <Route path="/register" element={<AuthRegister />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/hotels" element={<HotelsPage />} />
            <Route path="/hotels/:id" element={<HotelDetailPage />} />
            <Route path="/packages/:id" element={<PackageDetailsPage />} />
            <Route path="/flights" element={<FlightsPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/itenaryCreation" element={<ItineraryForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default RootLayout;

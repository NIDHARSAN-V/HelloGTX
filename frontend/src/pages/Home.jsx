import { useState } from "react";
import { MapPin, Search, Calendar, Users, ArrowRight } from "lucide-react";
import hBanner from "../assets/h-banner.jpg";
import FeaturedDestinations from "../components/FeaturedDestinations.jsx";
import TrendingTravelDeals from "../components/TrendingTravelDeal.jsx";
import TestimonialsSection from "./TestimonialSection.jsx";

export default function Home() {
  const [tab, setTab] = useState("destinations");

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full">
        <img
          src={hBanner}
          alt="Luxury travel destination"
          fill
          className="object-cover w-full h-full absolute top-0 left-0 z-[-1]"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 bg-opacity-50">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6">
            Discover Your Dream Destination
          </h1>
          <p className="text-lg md:text-xl text-center max-w-3xl mb-8">
            Explore exclusive travel experiences and luxury getaways around the
            world
          </p>

          {/* Search Tabs */}
          <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-lg p-4">
            <div className="grid grid-cols-4 mb-4">
              {["destinations", "hotels", "flights", "packages"].map((item) => (
                <button
                  key={item}
                  className={`p-2 ${
                    tab === item
                      ? "bg-white transition ease-in 300 rounded-lg text-black"
                      : "text-white"
                  }`}
                  onClick={() => setTab(item)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
                  <input
                    type="text"
                    placeholder={
                      tab === "flights" ? "From" : "Where do you want to go?"
                    }
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70 w-full p-2"
                  />
                </div>
                {tab !== "flights" && (
                  <div className="relative md:w-1/4">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
                    <input
                      type="date"
                      className="pl-10 bg-white/20 border-white/30 text-white w-full p-2"
                    />
                  </div>
                )}
                {tab === "hotels" && (
                  <div className="relative md:w-1/4">
                    <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
                    <input
                      type="text"
                      placeholder="Guests"
                      className="pl-10 bg-white/20 border-white/30 text-white w-full p-2"
                    />
                  </div>
                )}
                <button className="bg-primary hover:bg-primary/90 text-white p-2 flex items-center">
                  <Search className="mr-2 h-4 w-4" /> Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedDestinations />

      {/* Trending Deals */}
      <TrendingTravelDeals />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Newsletter */}
      <section className="bg-primary text-white py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Get Exclusive Travel Offers
          </h2>
          <p className="max-w-2xl mx-auto mb-8">
            Subscribe to our newsletter and be the first to receive special
            deals, travel tips, and inspiration for your next adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/70"
            />
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

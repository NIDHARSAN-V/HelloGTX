import React from "react";
import { Star } from "lucide-react";
import travelDealImg from "../assets/dealimg.avif";

const DealCard = ({ item }) => {
  return (
    <div className="relative bg-white rounded-lg overflow-hidden border-1 border-gray-200">
      {/* Discount Badge */}
      <div className="bg-red-500 text-white text-sm font-semibold px-3 py-1 inline-block rounded-br-lg absolute top-0 left-0 z-10">
        {item.discount} OFF
      </div>

      {/* Image Section */}
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-48 object-cover"
      />

      {/* Content Section */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center mb-2">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />{" "}
          {/* Star icon */}
          <span className="ml-1 text-sm font-semibold">{item.rating}</span>
        </div>

        {/* Title */}
        <h3 className="text-md font-bold mb-2">{item.title}</h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4">{item.description}</p>

        {/* Price and Discounted Price */}
        <div className="flex items-center mb-4">
          <span className="text-sm font-semibold text-gray-500 line-through ">
            ${item.originalPrice}
          </span>
          <span className="ml-2 text-sm font-bold text-blue-600 text-primary">
            ${item.discountedPrice}/person
          </span>
        </div>

        {/* Book Now Button */}
        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 bg-primary">
          Book Now
        </button>
      </div>
    </div>
  );
};

// Trending Travel Deals Section
const TrendingTravelDeals = () => {
  // Sample data for trending travel deals
  const deals = [
    {
      title: "Romantic Paris Getaway",
      description: "5 days in the city of love with luxury accommodations",
      originalPrice: 1299,
      discountedPrice: 1039,
      discount: "20%",
      rating: 4.8,
      image: travelDealImg,
    },
    {
      title: "Caribbean Cruise Adventure",
      description: "7-day cruise visiting Jamaica, Bahamas, and Mexico",
      originalPrice: 1899,
      discountedPrice: 1614,
      discount: "15%",
      rating: 4.7,
      image: travelDealImg,
    },
    {
      title: "Safari Experience in Kenya",
      description: "10-day wildlife adventure with guided tours",
      originalPrice: 2499,
      discountedPrice: 2249,
      discount: "10%",
      rating: 4.9,
      image: travelDealImg,
    },
  ];

  return (
    <section className="container py-16 bg-gray-50">
      <div className="max-w-screen-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">Trending Travel Deals</h2>
        <p className="text-muted-foreground mb-8">
          Limited-time offers on our most popular packages
        </p>
      </div>

      {/* Grid for Deal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-screen-2xl mx-auto">
        {deals.map((item, index) => (
          <DealCard key={index} item={item} />
        ))}
      </div>
    </section>
  );
};

export default TrendingTravelDeals;

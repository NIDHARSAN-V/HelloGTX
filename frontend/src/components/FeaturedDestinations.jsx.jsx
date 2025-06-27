import React from "react";
import { Star, MapPin } from "lucide-react";
import placeImg from "../assets/place1.jpg";
import DestinationCard from "./DestinationCard";

// Featured Destinations Section
const FeaturedDestinations = () => {
  // Sample data for featured destinations
  const destinations = [
    {
      name: "Bali, Indonesia",
      description:
        "Tropical paradise with stunning beaches and vibrant culture",
      price: 899,
      rating: 4.8,
      location: "Bali",
      image: placeImg,
    },
    {
      name: "Santorini, Greece",
      description: "Breathtaking views and iconic white and blue architecture",
      price: 1299,
      rating: 4.9,
      location: "Santorini",
      image: placeImg,
    },
    {
      name: "Kyoto, Japan",
      description: "Ancient temples, traditional gardens and rich history",
      price: 1499,
      rating: 4.7,
      location: "Kyoto",
      image: placeImg,
    },
    {
      name: "Maldives",
      description: "Crystal clear waters and luxurious overwater bungalows",
      price: 2199,
      rating: 5.0,
      location: "Maldives",
      image: placeImg,
    },
  ];

  return (
    <section className="container py-16">
      <div className="max-w-screen-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">Featured Destinations</h2>
        <p className="text-muted-foreground mb-8">
          Explore our handpicked destinations around the world
        </p>
      </div>

      {/* Grid for Destination Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-screen-2xl mx-auto">
        {destinations.map((item, index) => (
          <DestinationCard key={index} item={item} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedDestinations;

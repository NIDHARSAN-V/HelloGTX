import React, { useState } from "react";
import DestinationCard from "./DestinationCard";
import { Filter, Search } from "lucide-react";

export default function DestinationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample destinations data
  const destinations = {
    all: [
      {
        name: "Bali, Indonesia",
        description:
          "Tropical paradise with stunning beaches and vibrant culture",
        price: 899,
        rating: 4.8,
        image:
          "https://www.leisurekart.com/blog/wp-content/uploads/2024/04/Places-to-visit-in-Mumbai.jpg",
      },
      {
        name: "Santorini, Greece",
        description:
          "Breathtaking views and iconic white and blue architecture",
        price: 1299,
        rating: 4.9,
        image: "https://static.toiimg.com/photo/54422629.cms",
      },
      {
        name: "Kyoto, Japan",
        description: "Ancient temples, traditional gardens and rich history",
        price: 1499,
        rating: 4.7,
        image:
          "https://resources.thomascook.in/images/holidays/staticPage/ThingsToDo/PuraUlunbali.jpg",
      },
      {
        name: "Maldives",
        description: "Crystal clear waters and luxurious overwater bungalows",
        price: 2199,
        rating: 5.0,
        image:
          "https://images.wanderon.in/blogs/new/2023/06/desktop-wallpaper-kashmir-jammu-kashmir-min.jpg",
      },
      {
        name: "Paris, France",
        description:
          "Romantic city with iconic landmarks and exquisite cuisine",
        price: 1099,
        rating: 4.6,
        image:
          "https://www.alleppeyhouseboatclub.com/wp-content/uploads/2017/08/munnar_Image-by-Joseph-Saxan-Pulikkottil-Rappai-from-Pixabay-819x546.jpg",
      },
      {
        name: "Machu Picchu, Peru",
        description: "Ancient Incan citadel set amidst breathtaking mountains",
        price: 1699,
        rating: 4.9,
        image:
          "https://tourwithrahul.com/wp-content/uploads/2020/07/humayun-s-tomb-under-blue-sky-3672388-scaled.jpg",
      },
      {
        name: "New York, USA",
        description:
          "Vibrant metropolis with world-class attractions and dining",
        price: 1299,
        rating: 4.5,
        image:
          "https://www.esikkimtourism.in/wp-content/uploads/2019/04/3rd-image.jpg",
      },
      {
        name: "Cape Town, South Africa",
        description:
          "Stunning coastal city with diverse landscapes and wildlife",
        price: 1499,
        rating: 4.7,
        image:
          "https://blog.yatradham.org/wp-content/uploads/2021/03/Hampi.jpg",
      },
    ],
    beach: [
      {
        name: "Bali, Indonesia",
        description:
          "Tropical paradise with stunning beaches and vibrant culture",
        price: 899,
        rating: 4.8,
        image: "/placeholder.svg?height=400&width=600",
      },
      {
        name: "Maldives",
        description: "Crystal clear waters and luxurious overwater bungalows",
        price: 2199,
        rating: 5.0,
        image: "/placeholder.svg?height=400&width=600",
      },
      {
        name: "Cancun, Mexico",
        description: "Beautiful beaches and vibrant nightlife",
        price: 999,
        rating: 4.6,
        image: "/placeholder.svg?height=400&width=600",
      },
      {
        name: "Phuket, Thailand",
        description: "Tropical beaches with crystal clear waters",
        price: 899,
        rating: 4.7,
        image: "/placeholder.svg?height=400&width=600",
      },
    ],
    mountain: [
      {
        name: "Swiss Alps, Switzerland",
        description: "Majestic mountains and scenic landscapes",
        price: 1999,
        rating: 4.9,
        image: "/placeholder.svg?height=400&width=600",
      },
      {
        name: "Rocky Mountains, USA",
        description: "Stunning mountain ranges and outdoor adventures",
        price: 1499,
        rating: 4.7,
        image: "/placeholder.svg?height=400&width=600",
      },
    ],
    city: [
      {
        name: "Paris, France",
        description:
          "Romantic city with iconic landmarks and exquisite cuisine",
        price: 1099,
        rating: 4.6,
        image: "/placeholder.svg?height=400&width=600",
      },
      {
        name: "New York, USA",
        description:
          "Vibrant metropolis with world-class attractions and dining",
        price: 1299,
        rating: 4.5,
        image: "/placeholder.svg?height=400&width=600",
      },
    ],
    countryside: [
      {
        name: "Tuscany, Italy",
        description: "Rolling hills, vineyards, and charming villages",
        price: 1399,
        rating: 4.8,
        image: "/placeholder.svg?height=400&width=600",
      },
      {
        name: "Cotswolds, England",
        description: "Picturesque countryside with quaint cottages",
        price: 1199,
        rating: 4.7,
        image: "/placeholder.svg?height=400&width=600",
      },
    ],
    adventure: [
      {
        name: "Machu Picchu, Peru",
        description: "Ancient Incan citadel set amidst breathtaking mountains",
        price: 1699,
        rating: 4.9,
        image: "/placeholder.svg?height=400&width=600",
      },
      {
        name: "Queenstown, New Zealand",
        description: "Adventure capital of the world",
        price: 1599,
        rating: 4.8,
        image: "/placeholder.svg?height=400&width=600",
      },
    ],
  };

  // Filter destinations based on search query
  const filteredDestinations = destinations[activeTab].filter((destination) =>
    destination.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-8">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Explore Destinations</h1>
        <p className="text-muted-foreground mb-8">
          Discover amazing places around the world
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-screen-xl mx-auto">
        <div className="relative flex-grow">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <Search />
          </div>
          <input
            type="text"
            placeholder="Search destinations..."
            className="w-full pl-10 py-2 border border-gray-300 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="border border-gray-300 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-lg flex items-center">
          <span className="mr-2 text-gray-500"><Filter /></span> Filters
        </button>
      </div>

      {/* Category Tabs */}
      <div className="mb-8 max-w-screen-xl mx-auto">
        <div className="max-w-xl m-auto flex gap-1 p-2 bg-gray-200 rounded-lg ">
          {["all", "beach", "mountain", "city", "countryside", "adventure"].map(
            (tab) => (
              <button
                key={tab}
                className={`py-2 px-4 text-sm cursor-pointer rounded-lg transition ${
                  activeTab === tab ? "bg-white text-black" : "hover:bg-white"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            )
          )}
        </div>

        {/* Destination Grid */}
        <div className="mt-6 max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDestinations.map((destination, index) => (
              <DestinationCard item={destination} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

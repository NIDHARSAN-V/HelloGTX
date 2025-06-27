import React, { useState } from "react";
import PackageCard from "./PackageCard";
import { Filter, Search } from "lucide-react";
import travelDealImg from "../../assets/dealimg.avif";

const PackagesPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const deals = {
    all:[
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
    ],
    family:[
      {
        title: "Romantic Paris Getaway",
        description: "5 days in the city of love with luxury accommodations",
        originalPrice: 1299,
        discountedPrice: 1039,
        discount: "20%",
        rating: 4.8,
        image: travelDealImg,
      },
    ],
    honeymoon:[
      {
        title: "Romantic Paris Getaway",
        description: "5 days in the city of love with luxury accommodations",
        originalPrice: 1299,
        discountedPrice: 1039,
        discount: "20%",
        rating: 4.8,
        image: travelDealImg,
      },
    ],
    luxury:[
      {
        title: "Caribbean Cruise Adventure",
        description: "7-day cruise visiting Jamaica, Bahamas, and Mexico",
        originalPrice: 1899,
        discountedPrice: 1614,
        discount: "15%",
        rating: 4.7,
        image: travelDealImg,
      },
    ],
    adventure:[
      {
        title: "Safari Experience in Kenya",
        description: "10-day wildlife adventure with guided tours",
        originalPrice: 2499,
        discountedPrice: 2249,
        discount: "10%",
        rating: 4.9,
        image: travelDealImg,
      },
    ],
    
  };

  const filteredDeals = deals[activeTab].filter((deal) =>
    deal.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-8">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Travel Packages</h1>
        <p className="text-muted-foreground mb-8">
          Curated travel experiences for every type of traveler
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
          <span className="mr-2 text-gray-500">
            <Filter />
          </span>{" "}
          Filters
        </button>
      </div>

      {/* Category Tabs */}
      <div className="mb-8 max-w-screen-xl mx-auto">
        <div className="max-w-xl m-auto flex gap-1 p-2 bg-gray-200 rounded-lg ">
          {["all", "family", "honeymoon", "luxury", "adventure"].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 text-sm cursor-pointer rounded-lg transition ${
                activeTab === tab ? "bg-white text-black" : "hover:bg-white"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Destination Grid */}
        <div className="mt-6 max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredDeals.map((pac, index) => (
              <PackageCard item={pac} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagesPage;

import React, { useState, useEffect } from "react";
import PackageCard from "./PackageCard";
import PackageDetails from "./PackageDetails";
import { Filter, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPackages,
  filterPackages,
  searchPackages,
  fetchPackageById,
  clearCurrentPackage,
} from "../../Store/Package/packageSlice";

const PackagesPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const { packages, filteredPackages, currentPackage, loading, error } = useSelector(
    (state) => state.packages
  );

  useEffect(() => {
    dispatch(fetchPackages());
    return () => {
      dispatch(clearCurrentPackage());
    };
  }, [dispatch]);



  // useEffect(() => {
  //   if (activeTab === "all") {
  //     dispatch(fetchPackages());
  //   } else {
  //     dispatch(filterPackages(activeTab));
  //   }
  // }, [activeTab, dispatch]);


  

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        dispatch(searchPackages(searchQuery));
      } else {
        // If search query is empty, show all packages or filtered by active tab
        if (activeTab === "all") {
          dispatch(fetchPackages());
        } else {
          dispatch(filterPackages(activeTab));
        }
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timer);
  }, [searchQuery, activeTab, dispatch]);

  const handleViewDetails = (packageId) => {
    dispatch(fetchPackageById(packageId));
  };

  const handleBackToList = () => {
    dispatch(clearCurrentPackage());
  };

  if (loading)
    return <div className="container py-8 text-center">Loading...</div>;
  if (error)
    return (
      <div className="container py-8 text-center text-red-500">
        Error: {error.message || "Failed to load packages"}
      </div>
    );

  return (
    <div className="container py-8">
      {currentPackage ? (
        <PackageDetails 
          pkg={currentPackage} 
          onBack={handleBackToList} 
        />
      ) : (
        <>
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
                placeholder="Search destinations, packages..."
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
              {["all", "family", "honeymoon", "luxury", "adventure", "budget"].map(
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
              {filteredPackages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No packages found matching your criteria
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {filteredPackages.map((pkg) => (
                    <PackageCard 
                      key={pkg._id} 
                      pkg={pkg} 
                      onViewDetails={() => handleViewDetails(pkg._id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PackagesPage;
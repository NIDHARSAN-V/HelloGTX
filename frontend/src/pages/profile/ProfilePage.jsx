"use client";

import { useState } from "react";
import {
  User,
  Settings,
  CreditCard,
  Heart,
  Clock,
  Package,
  Calendar,
  MapPin,
  ChevronRight,
  LogOut,
  Plane,
  Hotel,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const [progress, setProgress] = useState(65);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-lg border-1 border-gray-200 p-6">
            <div className="text-center">
              <div className="mx-auto relative w-24 h-24 mb-2">
                <img
                  src="/placeholder.svg"
                  alt="User profile"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <h2 className="text-xl font-bold">John Doe</h2>
              <p className="text-sm text-gray-500">Premium Member</p>
            </div>
            <div className="mt-4">
              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Loyalty Points</span>
                  <span className="font-medium">650 / 1000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  Earn 350 more points for Gold status
                </p>
              </div>

              <nav className="space-y-1">
                <Link
                  href="/dashboard"
                  className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </Link>
                <Link
                  href="/dashboard/bookings"
                  className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  My Bookings
                </Link>
                <Link
                  href="/dashboard/wishlist"
                  className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Link>
                <Link
                  href="/dashboard/rewards"
                  className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Package className="mr-2 h-4 w-4" />
                  Rewards
                </Link>
                <Link
                  href="/dashboard/payment"
                  className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment Methods
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
                <button
                  onClick={() => console.log("Sign Out")}
                  className="flex items-center w-full p-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex space-x-4 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-2 text-sm font-medium ${
                  activeTab === "overview"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`pb-2 text-sm font-medium ${
                  activeTab === "bookings"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setActiveTab("wishlist")}
                className={`pb-2 text-sm font-medium ${
                  activeTab === "wishlist"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Wishlist
              </button>
              <button
                onClick={() => setActiveTab("rewards")}
                className={`pb-2 text-sm font-medium ${
                  activeTab === "rewards"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Rewards
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div>
              {/* Upcoming Trip */}
              <div className="bg-white rounded-lg border-1 border-gray-200 mb-6">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2">Upcoming Trip</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Your next adventure is just around the corner
                  </p>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative h-40 md:w-1/3 rounded-md overflow-hidden">
                      <img
                        src="https://www.leisurekart.com/blog/wp-content/uploads/2024/04/Places-to-visit-in-Mumbai.jpg"
                        alt="Bali trip"
                        fill
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        Bali Retreat Package
                      </h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">
                            June 15 - June 22, 2025
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">Bali, Indonesia</span>
                        </div>
                        <div className="flex items-center">
                          <Hotel className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">Luxury Beach Resort</span>
                        </div>
                        <div className="flex items-center">
                          <Plane className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">Flight Included</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          <Clock className="h-4 w-4 inline mr-1" />
                          <span>Departing in 45 days</span>
                        </div>
                        <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-white rounded-lg border-1 border-gray-200 mb-6">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-md overflow-hidden">
                          <img
                            src="https://www.leisurekart.com/blog/wp-content/uploads/2024/04/Places-to-visit-in-Mumbai.jpg"
                            alt="Paris"
                            fill
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">Paris Weekend Getaway</h4>
                          <p className="text-sm text-gray-500">
                            April 10 - April 13, 2025
                          </p>
                        </div>
                      </div>
                      <button className="p-2 text-gray-500 hover:text-gray-700">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-md overflow-hidden">
                          <img
                            src="https://www.leisurekart.com/blog/wp-content/uploads/2024/04/Places-to-visit-in-Mumbai.jpg"
                            alt="New York"
                            fill
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            New York City Explorer
                          </h4>
                          <p className="text-sm text-gray-500">
                            March 5 - March 10, 2025
                          </p>
                        </div>
                      </div>
                      <button className="p-2 text-gray-500 hover:text-gray-700">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended for You */}
              <div className="bg-white rounded-lg border-1 border-gray-200">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">
                    Recommended for You
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-20 rounded-md overflow-hidden">
                        <img
                          src="https://www.leisurekart.com/blog/wp-content/uploads/2024/04/Places-to-visit-in-Mumbai.jpg"
                          alt="Santorini"
                          fill
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Santorini Escape</h4>
                        <p className="text-sm text-gray-500 mb-1">
                          7 days from $1,299
                        </p>
                        <button className="px-4 py-2 border border-gray-300 text-sm rounded-lg">
                          View Deal
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="relative h-20 w-20 rounded-md overflow-hidden">
                        <img
                          src="https://www.leisurekart.com/blog/wp-content/uploads/2024/04/Places-to-visit-in-Mumbai.jpg"
                          alt="Maldives"
                          fill
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Maldives Luxury</h4>
                        <p className="text-sm text-gray-500 mb-1">
                          10 days from $2,499
                        </p>
                        <button className="px-4 py-2 border border-gray-300 text-sm rounded-lg">
                          View Deal
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div>
              {/* Bookings Content */}
              <div className="bg-white">
                <div>
                  <h2 className="text-xl font-bold mb-4">My Bookings</h2>
                  <div className="space-y-6">
                    {/* Booking Item */}
                    <div className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="relative h-32 md:w-1/4 rounded-md overflow-hidden">
                          <img
                            src="https://www.leisurekart.com/blog/wp-content/uploads/2024/04/Places-to-visit-in-Mumbai.jpg"
                            alt="Bali trip"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-semibold">
                              Bali Retreat Package
                            </h3>
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Confirmed
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="text-sm">
                                June 15 - June 22, 2025
                              </span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="text-sm">Bali, Indonesia</span>
                            </div>
                            <div className="flex items-center">
                              <Hotel className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="text-sm">
                                Luxury Beach Resort
                              </span>
                            </div>
                            <div className="flex items-center">
                              <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="text-sm">$2,199 (Paid)</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-4">
                            <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg">
                              View Details
                            </button>
                            <button className="px-4 py-2 border border-gray-300 text-sm rounded-lg">
                              Modify
                            </button>
                            <button className="px-4 py-2 border border-gray-300 text-sm rounded-lg">
                              Download Itinerary
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "wishlist" && (
            <div>
              {/* Wishlist Content */}
              <div className="bg-white rounded-lg">
                <div>
                  <h2 className="text-xl font-bold mb-4">My Wishlist</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Wishlist Item */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="relative h-40 w-full">
                        <img
                          src="https://www.leisurekart.com/blog/wp-content/uploads/2024/04/Places-to-visit-in-Mumbai.jpg"
                          alt="Santorini"
                          fill
                          className="object-cover w-full h-full"
                        />
                        <button className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white/90 rounded-full">
                          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-1">Santorini Escape</h3>
                        <p className="text-sm text-gray-500 mb-2">
                          7 days from $1,299
                        </p>
                        <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "rewards" && (
            <div>
              {/* Rewards Content */}
              <div className="bg-white">
                <div>
                  <h2 className="text-xl font-bold mb-4">My Rewards</h2>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">Current Points</h3>
                      <span className="text-2xl font-bold text-blue-500">
                        650
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      You're 65% of the way to Gold status (1,000 points)
                    </p>
                  </div>

                  <h3 className="font-semibold mb-4">Available Rewards</h3>
                  <div className="space-y-4">
                    {/* Reward Item */}
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">
                            Free Airport Lounge Access
                          </h4>
                          <p className="text-sm text-gray-500">
                            One-time access to premium airport lounges
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="block font-bold text-blue-500">
                            300 pts
                          </span>
                          <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg mt-2">
                            Redeem
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

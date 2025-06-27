import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Utensils,
  Wifi,
  Car,
  Plane,
  Hotel,
  Camera,
  Check,
  Star,
  Heart,
  Waves,
  Coffee,
} from "lucide-react";

const PackageDetailsPage = () => {
  /* const packageName = params.id
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '); */

  const [tab, setTab] = useState("overview");

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{"Bali Paradise Retreat"}</h1>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">Bali, Indonesia</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-primary text-primary mr-1" />
              <span className="font-medium">4.9</span>
              <span className="text-muted-foreground ml-1">(86 reviews)</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 ml-auto">
          <button className="p-2 border rounded-md">
            <Heart className="h-4 w-4" />
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Book Now
          </button>
        </div>
      </div>

      {/* Package Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 relative h-[400px] rounded-lg overflow-hidden">
          <img
            src="https://www.questtours.in/backend-assets/uploads/shutterstock_127288088_copy.jpg"
            alt="Package main image"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative h-[190px] rounded-lg overflow-hidden">
            <img
              src="https://www.questtours.in/backend-assets/uploads/shutterstock_127288088_copy.jpg"
              alt="Package image 2"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="relative h-[190px] rounded-lg overflow-hidden">
            <img
              src="https://www.questtours.in/backend-assets/uploads/shutterstock_127288088_copy.jpg"
              alt="Package image 3"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="relative h-[190px] rounded-lg overflow-hidden">
            <img
              src="https://www.questtours.in/backend-assets/uploads/shutterstock_127288088_copy.jpg"
              alt="Package image 4"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="relative h-[190px] rounded-lg overflow-hidden">
            <button className="absolute inset-0 bg-black/50 hover:bg-black/60 text-white w-full h-full rounded-lg">
              +8 more
            </button>
            <img
              src="https://www.questtours.in/backend-assets/uploads/shutterstock_127288088_copy.jpg"
              alt="Package image 5"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setTab("overview")}
                className="px-4 py-2 rounded-md bg-gray-200 active:bg-primary text-primary"
              >
                Overview
              </button>
              <button
                className="px-4 py-2 rounded-md bg-gray-200"
                onClick={() => setTab("itinerary")}
              >
                Itinerary
              </button>
              <button
                className="px-4 py-2 rounded-md bg-gray-200"
                onClick={() => setTab("inclusions")}
              >
                Inclusions
              </button>
              <button
                className="px-4 py-2 rounded-md bg-gray-200"
                onClick={() => setTab("accommodations")}
              >
                Accommodations
              </button>
              <button
                className="px-4 py-2 rounded-md bg-gray-200"
                onClick={() => setTab("reviews")}
              >
                Reviews
              </button>
            </div>
          </div>

          {tab === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  About this package
                </h2>
                <p className="text-muted-foreground mb-4">
                  Experience the ultimate Balinese getaway with our 7-day Bali
                  Paradise Retreat package. This carefully curated journey
                  combines luxury accommodations, cultural experiences, and
                  natural wonders to give you an unforgettable taste of the
                  Island of the Gods.
                </p>
                <p className="text-muted-foreground mb-4">
                  From the moment you arrive, you'll be immersed in Bali's
                  unique blend of spiritual tranquility and vibrant culture.
                  Stay in a luxurious beachfront resort in Nusa Dua, explore
                  ancient temples, discover hidden waterfalls, and indulge in
                  authentic Balinese cuisine.
                </p>
                <p className="text-muted-foreground">
                  Whether you're seeking relaxation, adventure, or cultural
                  enrichment, this package offers the perfect balance of guided
                  excursions and free time to create your own memories. Our
                  experienced local guides will ensure you experience the
                  authentic Bali that lies beyond the tourist trails.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Luxury Beachfront Resort</h3>
                      <p className="text-sm text-muted-foreground">
                        6 nights in a 5-star resort with private pool villas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Cultural Immersion</h3>
                      <p className="text-sm text-muted-foreground">
                        Visit ancient temples and traditional villages
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Natural Wonders</h3>
                      <p className="text-sm text-muted-foreground">
                        Explore rice terraces, waterfalls, and volcanic
                        landscapes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Culinary Experiences</h3>
                      <p className="text-sm text-muted-foreground">
                        Cooking class and gourmet dining experiences
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Wellness & Relaxation</h3>
                      <p className="text-sm text-muted-foreground">
                        Traditional spa treatments and yoga sessions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Private Transportation</h3>
                      <p className="text-sm text-muted-foreground">
                        Dedicated driver and guide throughout your stay
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Package Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center p-4 bg-muted rounded-lg">
                    <Calendar className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium">Duration</h3>
                    <p className="text-muted-foreground">7 Days / 6 Nights</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-muted rounded-lg">
                    <Users className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium">Group Size</h3>
                    <p className="text-muted-foreground">Up to 12 people</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-muted rounded-lg">
                    <MapPin className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium">Destinations</h3>
                    <p className="text-muted-foreground">
                      Nusa Dua, Ubud, Uluwatu
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-muted rounded-lg">
                    <Plane className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium">Flights</h3>
                    <p className="text-muted-foreground">
                      International flights included
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-muted rounded-lg">
                    <Hotel className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium">Accommodation</h3>
                    <p className="text-muted-foreground">
                      5-star luxury resorts
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-muted rounded-lg">
                    <Utensils className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium">Meals</h3>
                    <p className="text-muted-foreground">
                      Breakfast daily, 3 lunches, 4 dinners
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-8">
            {/* Itinerary Section */}
            {tab === "itinerary" && (
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6 relative">
                  <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[10px] top-0"></div>
                  <h3 className="text-xl font-semibold mb-2">
                    Day 1: Arrival in Bali
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Nusa Dua</span>
                  </div>
                  <p className="text-gray-500 mb-4">
                    Upon arrival at Ngurah Rai International Airport, you'll be
                    greeted by your private driver and transferred to your
                    luxury beachfront resort in Nusa Dua. Enjoy a welcome drink
                    and take the rest of the day to relax and acclimate to the
                    tropical paradise.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 border rounded-full text-sm">
                      Airport Transfer
                    </span>
                    <span className="px-3 py-1 border rounded-full text-sm">
                      Welcome Dinner
                    </span>
                    <span className="px-3 py-1 border rounded-full text-sm">
                      Luxury Resort
                    </span>
                  </div>
                </div>

                {/* Repeat for other days */}
                <div className="border-l-4 border-blue-500 pl-6 relative">
                  <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[10px] top-0"></div>
                  <h3 className="text-xl font-semibold mb-2">
                    Day 2: Uluwatu Temple & Cultural Show
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Uluwatu, Jimbaran</span>
                  </div>
                  <p className="text-gray-500 mb-4">
                    After a leisurely breakfast, spend the morning at your
                    resort's private beach or spa. In the afternoon, visit the
                    clifftop Uluwatu Temple for breathtaking ocean views and
                    witness the famous Kecak Fire Dance at sunset. End the day
                    with a seafood dinner on Jimbaran Beach.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 border rounded-full text-sm">
                      Temple Visit
                    </span>
                    <span className="px-3 py-1 border rounded-full text-sm">
                      Cultural Performance
                    </span>
                    <span className="px-3 py-1 border rounded-full text-sm">
                      Seafood Dinner
                    </span>
                  </div>
                </div>

                {/* Add more days as needed */}
              </div>
            )}

            {/* Inclusions Section */}
            {tab === "inclusions" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">What's Included</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                    <span>
                      Round-trip international flights from selected major
                      cities
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                    <span>6 nights accommodation in luxury 5-star resorts</span>
                  </li>
                  {/* Add more inclusions as needed */}
                </ul>

                <h2 className="text-xl font-semibold mb-4">
                  What's Not Included
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <span>Travel insurance (strongly recommended)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <span>Visa fees (if applicable)</span>
                  </li>
                  {/* Add more exclusions as needed */}
                </ul>

                <h2 className="text-xl font-semibold mb-4">Optional Add-ons</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                    <div>
                      <span className="font-medium">
                        White Water Rafting Adventure
                      </span>
                      <p className="text-sm text-gray-500">
                        Experience thrilling rapids on the Ayung River ($75 per
                        person)
                      </p>
                    </div>
                  </li>
                  {/* Add more add-ons as needed */}
                </ul>
              </div>
            )}

            {/* Accommodations Section */}
            {tab === "accommodations" && (
              <div className="space-y-8">
                <div className="border rounded-lg overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative h-64 md:h-auto md:w-1/3">
                      <img
                        src="/placeholder.svg?height=400&width=600"
                        alt="Luxury Resort"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-6 flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        The Ritz-Carlton Bali
                      </h3>
                      <div className="flex items-center mb-4">
                        <div className="flex mr-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          Nusa Dua (3 nights)
                        </span>
                      </div>
                      <p className="text-gray-500 mb-4">
                        Nestled on the beachfront of Nusa Dua, The Ritz-Carlton
                        Bali offers an indulgent escape with stunning ocean
                        views, luxurious accommodations, and world-class
                        amenities.
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                        <div className="flex items-center text-sm">
                          <Wifi className="h-4 w-4 mr-1 text-gray-500" />
                          <span>Free WiFi</span>
                        </div>
                        {/* Add more amenities as needed */}
                      </div>
                      <button className="px-4 py-2 border rounded-md text-sm">
                        View Hotel Details
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add more accommodations as needed */}
              </div>
            )}
            {/* Reviews Section */}
            {tab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">Guest Reviews</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < 4
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 font-medium">4.9</span>
                      <span className="text-gray-500 ml-1">(86 reviews)</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                    Write a Review
                  </button>
                </div>

                {/* Review Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="w-24 text-sm">Excellent</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[85%]"></div>
                      </div>
                      <span className="w-12 text-sm text-right">85%</span>
                    </div>
                    {/* Add more review breakdown items as needed */}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="w-32 text-sm">Value for Money</span>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < 4
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm">4.8</span>
                    </div>
                    {/* Add more review metrics as needed */}
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-6">
                  <div className="border-b pb-6">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                          <img
                            src="/placeholder.svg?height=100&width=100"
                            alt="Reviewer"
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">Jennifer Adams</h4>
                          <p className="text-xs text-gray-500">United States</p>
                        </div>
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      "This Bali package exceeded all our expectations! The
                      itinerary was perfectly balanced between activities and
                      relaxation time."
                    </p>
                    <p className="text-xs text-gray-500">
                      Traveled: February 2025 | Traveled as: Couple
                    </p>
                  </div>

                  {/* Add more reviews as needed */}
                </div>

                <button className="w-full px-4 py-2 border rounded-md">
                  Load More Reviews
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Booking Card */}
        <div>
          <div className="sticky top-24 bg-white border rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-2xl font-bold text-primary">
                    $2,499
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {" "}
                    / person
                  </span>
                </div>
                <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
                  20% OFF
                </span>
              </div>

              <div className="text-sm text-muted-foreground line-through mb-6">
                Regular price: $3,125
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Departure Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <select className="w-full pl-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <option>May 15, 2025</option>
                      <option>June 1, 2025</option>
                      <option>June 15, 2025</option>
                      <option>July 1, 2025</option>
                      <option>July 15, 2025</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Travelers
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <select className="w-full pl-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <option>1 Adult</option>
                      <option>2 Adults</option>
                      <option>2 Adults, 1 Child</option>
                      <option>2 Adults, 2 Children</option>
                      <option>Group (5+ travelers)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-b py-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Package Price (2 Adults)</span>
                  <span className="text-sm">$4,998</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Taxes & fees</span>
                  <span className="text-sm">$499</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>$5,497</span>
                </div>
              </div>

              <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-md mb-4">
                Book Now
              </button>
              <p className="text-xs text-center text-muted-foreground mb-4">
                You won't be charged yet
              </p>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Limited availability - only 4 spots left!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Packages */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">
          Similar Packages You Might Like
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="relative h-48 w-full">
              <img
                src="https://gmgwltd.com/wp-content/uploads/2024/01/full-shot-travel.jpg"
                alt="Thailand package"
                className="object-cover w-full h-full"
              />
              <span className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded-full">
                Bestseller
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold mb-2">Thailand Explorer</h3>
              <div className="flex items-center mb-2">
                <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Bangkok, Chiang Mai, Phuket
                </span>
              </div>
              <div className="flex items-center mb-4">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">10 days</span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Experience the best of Thailand from bustling Bangkok to the
                serene beaches of Phuket.
              </p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-bold text-primary">$1,899</span>
                  <span className="text-xs text-muted-foreground">
                    {" "}
                    / person
                  </span>
                </div>
                <button className="px-4 py-2 border rounded-md text-sm">
                  View Details
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="relative h-48 w-full">
              <img
                src="https://gmgwltd.com/wp-content/uploads/2024/01/full-shot-travel.jpg"
                alt="Japan package"
                className="object-cover w-full h-full"
              />
              <span className="absolute top-3 left-3 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                New
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold mb-2">Japan Highlights</h3>
              <div className="flex items-center mb-2">
                <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Tokyo, Kyoto, Osaka
                </span>
              </div>
              <div className="flex items-center mb-4">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">12 days</span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Discover the perfect blend of ancient traditions and modern
                wonders in Japan.
              </p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-bold text-primary">$3,299</span>
                  <span className="text-xs text-muted-foreground">
                    {" "}
                    / person
                  </span>
                </div>
                <button className="px-4 py-2 border rounded-md text-sm">
                  View Details
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="relative h-48 w-full">
              <img
                src="https://gmgwltd.com/wp-content/uploads/2024/01/full-shot-travel.jpg"
                alt="Greece package"
                className="object-cover w-full h-full"
              />
              <span className="absolute top-3 left-3 bg-pink-100 text-pink-800 text-sm px-2 py-1 rounded-full">
                Popular
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold mb-2">
                Greek Islands Hopping
              </h3>
              <div className="flex items-center mb-2">
                <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Athens, Mykonos, Santorini
                </span>
              </div>
              <div className="flex items-center mb-4">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">9 days</span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Island hop through the stunning Cyclades and experience the best
                of Greek culture.
              </p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-bold text-primary">$2,799</span>
                  <span className="text-xs text-muted-foreground">
                    {" "}
                    / person
                  </span>
                </div>
                <button className="px-4 py-2 border rounded-md text-sm">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PackageDetailsPage;

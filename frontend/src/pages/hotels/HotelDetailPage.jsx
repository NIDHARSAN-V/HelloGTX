import React, { useState } from "react";
import {
  MapPin,
  Star,
  Wifi,
  Coffee,
  Utensils,
  Dumbbell,
  Waves,
  Check,
  Calendar,
  Users,
  Heart,
} from "lucide-react";

export default function HotelDetailPage() {
  /* const hotelName = params.id
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '); */

  const [tab, setTab] = useState("overview");

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {"" || "Grand Luxury Resort & Spa"}
          </h1>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">Bali, Indonesia</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-primary text-primary mr-1" />
              <span className="font-medium">5.0</span>
              <span className="text-muted-foreground ml-1">(128 reviews)</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 ml-auto">
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100">
            <Heart className="h-4 w-4" />
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Book Now
          </button>
        </div>
      </div>

      {/* Hotel Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 relative h-[400px] rounded-lg overflow-hidden">
          <img
            src="https://housing.com/news/wp-content/uploads/2022/11/Famous-tourist-places-in-India-state-compressed.jpg"
            alt="Hotel main image"
            fill
            className="object-cover w-full h-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative h-[190px] rounded-lg overflow-hidden">
            <img
              src="https://housing.com/news/wp-content/uploads/2022/11/Famous-tourist-places-in-India-state-compressed.jpg"
              alt="Hotel image 2"
              fill
              className="object-cover w-full h-full"
            />
          </div>
          <div className="relative h-[190px] rounded-lg overflow-hidden">
            <img
              src="https://housing.com/news/wp-content/uploads/2022/11/Famous-tourist-places-in-India-state-compressed.jpg"
              alt="Hotel image 3"
              fill
              className="object-cover w-full h-full"
            />
          </div>
          <div className="relative h-[190px] rounded-lg overflow-hidden">
            <img
              src="https://housing.com/news/wp-content/uploads/2022/11/Famous-tourist-places-in-India-state-compressed.jpg"
              alt="Hotel image 4"
              fill
              className="object-cover w-full h-full"
            />
          </div>
          <div className="relative h-[190px] rounded-lg overflow-hidden">
            <button className="absolute inset-0 bg-black/50 hover:bg-black/60 text-white w-full h-full rounded-lg">
              +12 more
            </button>
            <img
              src="https://housing.com/news/wp-content/uploads/2022/11/Famous-tourist-places-in-India-state-compressed.jpg"
              alt="Hotel image 5"
              fill
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex gap-4 mb-6 bg-gray-200 rounded-lg p-2">
            <button
              className={`text-sm font-medium p-2 cursor-pointer rounded-lg ${
                tab === "overview" ? "text-black bg-white" : ""
              }`}
              onClick={() => setTab("overview")}
            >
              Overview
            </button>
            <button
              className={`text-sm cursor-pointer font-medium p-2 rounded-lg ${
                tab === "rooms" ? "text-black bg-white" : ""
              }`}
              onClick={() => setTab("rooms")}
            >
              Rooms
            </button>
            <button
              className={`text-sm cursor-pointer font-medium p-2 rounded-lg ${
                tab === "amenities" ? "text-black bg-white" : ""
              }`}
              onClick={() => setTab("amenities")}
            >
              Amenities
            </button>
            <button
              className={`text-sm cursor-pointer font-medium p-2 rounded-lg ${
                tab === "reviews" ? "text-black bg-white" : ""
              }`}
              onClick={() => setTab("reviews")}
            >
              Reviews
            </button>
            <button
              className={`text-sm cursor-pointer font-medium p-2 rounded-lg ${
                tab === "location" ? "text-black bg-white" : ""
              }`}
              onClick={() => setTab("location")}
            >
              Location
            </button>
          </div>

          {/* Overview Tab */}
          {tab === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">About this hotel</h2>
                <p className="text-muted-foreground mb-4">
                  Nestled on the pristine shores of Bali, the Grand Luxury
                  Resort & Spa offers an unparalleled retreat for discerning
                  travelers. This 5-star beachfront paradise combines
                  traditional Balinese architecture with modern luxury, creating
                  a harmonious sanctuary where guests can indulge in the
                  ultimate relaxation experience.
                </p>
                <p className="text-muted-foreground mb-4">
                  Each of our spacious villas and suites features private pools,
                  stunning ocean views, and elegant interiors adorned with local
                  artwork. The resort boasts world-class amenities including a
                  full-service spa, multiple infinity pools, and gourmet
                  restaurants serving both international cuisine and authentic
                  local dishes.
                </p>
                <p className="text-muted-foreground">
                  Whether you're seeking a romantic getaway, a family vacation,
                  or a solo wellness retreat, our attentive staff is dedicated
                  to providing personalized service that exceeds expectations.
                  Experience the magic of Bali in unparalleled luxury at the
                  Grand Luxury Resort & Spa.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Beachfront Location</h3>
                      <p className="text-sm text-muted-foreground">
                        Direct access to a private white sand beach
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Luxury Spa</h3>
                      <p className="text-sm text-muted-foreground">
                        Award-winning spa with traditional treatments
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Gourmet Dining</h3>
                      <p className="text-sm text-muted-foreground">
                        Multiple restaurants with world-class chefs
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Private Villas</h3>
                      <p className="text-sm text-muted-foreground">
                        Secluded villas with private pools and butler service
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rooms Tab */}
          {tab === "rooms" && (
            <div className="space-y-6">
              {/* Room Card Example */}
              <div className="bg-white flex rounded-lg border-1 border-gray-200 p-2 gap-4 grid-cols-5">
                <img
                  src="https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?cs=srgb&dl=pexels-jvdm-1457842.jpg&fm=jpg"
                  alt="Deluxe Ocean View Room"
                  className="w-88 h-50 object-cover rounded-lg col-span-2"
                />
                <div className="mt-4">
                  <h3 className="text-xl font-bold">Deluxe Ocean View Room</h3>
                  <p className="text-sm text-gray-600">
                    Spacious room with king-size bed and private balcony
                    overlooking the ocean
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500 flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </span>
                    <span className="ml-2 text-sm">4.9</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Tropical paradise with stunning beaches and vibrant culture
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-bold">$250/night</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Repeat for other rooms */}
            </div>
          )}

          {/* Amenities Tab */}
          {tab === "amenities" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Property Amenities
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Waves className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="font-medium">Swimming Pools</h4>
                      <p className="text-sm text-muted-foreground">
                        3 outdoor infinity pools, including adults-only pool
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Utensils className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="font-medium">Restaurants & Bars</h4>
                      <p className="text-sm text-muted-foreground">
                        4 restaurants, 2 bars, and private dining options
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Dumbbell className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="font-medium">Fitness & Recreation</h4>
                      <p className="text-sm text-muted-foreground">
                        24-hour fitness center, yoga classes, water sports
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Coffee className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="font-medium">Spa & Wellness</h4>
                      <p className="text-sm text-muted-foreground">
                        Full-service spa, sauna, steam room, wellness programs
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Room Amenities</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Wifi className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="font-medium">Technology</h4>
                      <p className="text-sm text-muted-foreground">
                        Free high-speed WiFi, smart TV, Bluetooth speakers
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Coffee className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="font-medium">Comfort</h4>
                      <p className="text-sm text-muted-foreground">
                        Premium bedding, pillow menu, blackout curtains
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Utensils className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="font-medium">Food & Drink</h4>
                      <p className="text-sm text-muted-foreground">
                        Minibar, coffee maker, 24-hour room service
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="font-medium">Bathroom</h4>
                      <p className="text-sm text-muted-foreground">
                        Rainfall shower, soaking tub, luxury toiletries
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {tab === "reviews" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Guest Reviews</h3>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-medium">5.0</span>
                    <span className="text-muted-foreground ml-1">
                      (128 reviews)
                    </span>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Write a Review
                </button>
              </div>

              {/* Review Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="w-24 text-sm">Excellent</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[90%]"></div>
                    </div>
                    <span className="w-12 text-sm text-right">90%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-24 text-sm">Very Good</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[7%]"></div>
                    </div>
                    <span className="w-12 text-sm text-right">7%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-24 text-sm">Average</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[2%]"></div>
                    </div>
                    <span className="w-12 text-sm text-right">2%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-24 text-sm">Poor</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[1%]"></div>
                    </div>
                    <span className="w-12 text-sm text-right">1%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-24 text-sm">Terrible</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[0%]"></div>
                    </div>
                    <span className="w-12 text-sm text-right">0%</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="w-24 text-sm">Cleanliness</span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm">5.0</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-24 text-sm">Comfort</span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm">5.0</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-24 text-sm">Location</span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm">5.0</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-24 text-sm">Service</span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm">5.0</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-24 text-sm">Value</span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < 4 ? "fill-primary text-primary" : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm">4.8</span>
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6 mt-6">
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                        <img
                          src="https://media.istockphoto.com/id/1051172208/photo/happy-woman-posing-looking-at-camera-in-winter-in-the-street.jpg?s=612x612&w=0&k=20&c=m1BxTjS6vlUZT8tOPunuNKMeGc0EEFHOnjWYyhP92N0="
                          alt="Reviewer"
                          fill
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">Sarah Johnson</h4>
                        <p className="text-xs text-muted-foreground">
                          United States
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-primary text-primary"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    "Our stay at the Grand Luxury Resort was absolutely perfect.
                    The staff went above and beyond to make our honeymoon
                    special. The private pool villa was stunning and the food at
                    all restaurants was exceptional. We can't wait to return!"
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Stayed: March 2025 | Traveled as: Couple
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                        <img
                          src="https://media.istockphoto.com/id/1051172208/photo/happy-woman-posing-looking-at-camera-in-winter-in-the-street.jpg?s=612x612&w=0&k=20&c=m1BxTjS6vlUZT8tOPunuNKMeGc0EEFHOnjWYyhP92N0="
                          alt="Reviewer"
                          fill
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">David Chen</h4>
                        <p className="text-xs text-muted-foreground">Canada</p>
                      </div>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-primary text-primary"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    "This resort exceeded all expectations. The beachfront
                    location is breathtaking, and the attention to detail in
                    service is impeccable. The spa treatments were the best I've
                    ever experienced. Highly recommend the sunset dinner on the
                    beach!"
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Stayed: February 2025 | Traveled as: Family
                  </p>
                </div>
              </div>

              <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                Load More Reviews
              </button>
            </div>
          )}

          {/* Location Tab */}
          {tab === "location" && (
            <div className="space-y-6">
              <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                <img
                  src="https://www.thestatesman.com/wp-content/uploads/2020/04/googl_ED.jpg"
                  alt="Map location"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-medium">
                    Interactive Map Would Appear Here
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Location Information
                </h3>
                <p className="text-muted-foreground mb-4">
                  Located on the pristine shores of Nusa Dua, Grand Luxury
                  Resort & Spa offers a perfect balance of seclusion and
                  accessibility. The resort is nestled on a private beach, yet
                  just 20 minutes from Bali's cultural attractions and 15
                  minutes from Ngurah Rai International Airport.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="font-medium mb-2">Nearby Attractions</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>Nusa Dua Beach (0.1 miles)</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>Bali Collection Shopping Center (1.2 miles)</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>Water Blow (1.5 miles)</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>Uluwatu Temple (12 miles)</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>Ubud Cultural Center (25 miles)</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Getting Around</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>
                          Ngurah Rai International Airport (15 minutes by car)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>Complimentary airport transfers</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>Resort shuttle to nearby attractions</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>Car rental and chauffeur services available</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                        <span>Bicycle rentals for local exploration</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Booking Card */}
        <div>
          <div className="sticky top-24 bg-white rounded-lg border-1 border-gray-200 p-6">
            <h3 className="text-xl font-semibold mb-4">Book Your Stay</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Check-in
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="date"
                    className="w-full pl-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Check-out
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="date"
                    className="w-full pl-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Guests</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <select className="w-full pl-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                    <option>1 Adult</option>
                    <option>2 Adults</option>
                    <option>2 Adults, 1 Child</option>
                    <option>2 Adults, 2 Children</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-b py-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm">$299 x 5 nights</span>
                <span className="text-sm">$1,495</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Taxes & fees</span>
                <span className="text-sm">$299</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>$1,794</span>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-4">
              Book Now
            </button>
            <p className="text-xs text-center text-muted-foreground">
              You won't be charged yet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

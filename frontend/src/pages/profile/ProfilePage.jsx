// "use client";

// import { useState } from "react";
// import {
//   User,
//   Settings,
//   CreditCard,
//   Heart,
//   Clock,
//   Package,
//   Calendar,
//   MapPin,
//   ChevronRight,
//   LogOut,
//   Plane,
//   Hotel,
// } from "lucide-react";
// import { Link } from "react-router-dom";

// export default function ProfilePage() {
//   const [progress, setProgress] = useState(65);
//   const [activeTab, setActiveTab] = useState("overview");

//   return (
//     <div className="container py-8">
//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Sidebar */}
//         <div className="md:w-1/4">
//           <div className="bg-white rounded-lg border-1 border-gray-200 p-6">
//             <div className="text-center">
//               <div className="mx-auto relative w-24 h-24 mb-2">
//                 <img
//                   src="/placeholder.svg"
//                   alt="User profile"
//                   fill
//                   className="rounded-full object-cover"
//                 />
//               </div>
//               <h2 className="text-xl font-bold">John Doe</h2>
//               <p className="text-sm text-gray-500">Premium Member</p>
//             </div>
//             <div className="mt-4">
//               <div className="space-y-1 mb-4">
//                 <div className="flex justify-between text-sm">
//                   <span>Loyalty Points</span>
//                   <span className="font-medium">650 / 1000</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div
//                     className="bg-blue-500 h-2 rounded-full"
//                     style={{ width: `${progress}%` }}
//                   ></div>
//                 </div>
//                 <p className="text-xs text-gray-500">
//                   Earn 350 more points for Gold status
//                 </p>
//               </div>

//               <nav className="space-y-1">
//                 <Link
//                   href="/dashboard"
//                   className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
//                 >
//                   <User className="mr-2 h-4 w-4" />
//                   My Profile
//                 </Link>
//                 <Link
//                   href="/dashboard/bookings"
//                   className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
//                 >
//                   <Calendar className="mr-2 h-4 w-4" />
//                   My Bookings
//                 </Link>
//                 <Link
//                   href="/dashboard/wishlist"
//                   className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
//                 >
//                   <Heart className="mr-2 h-4 w-4" />
//                   Wishlist
//                 </Link>
//                 <Link
//                   href="/dashboard/rewards"
//                   className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
//                 >
//                   <Package className="mr-2 h-4 w-4" />
//                   Rewards
//                 </Link>
//                 <Link
//                   href="/dashboard/payment"
//                   className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
//                 >
//                   <CreditCard className="mr-2 h-4 w-4" />
//                   Payment Methods
//                 </Link>
//                 <Link
//                   href="/dashboard/settings"
//                   className="flex items-center w-full p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
//                 >
//                   <Settings className="mr-2 h-4 w-4" />
//                   Settings
//                 </Link>
//                 <button
//                   onClick={() => console.log("Sign Out")}
//                   className="flex items-center w-full p-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
//                 >
//                   <LogOut className="mr-2 h-4 w-4" />
//                   Sign Out
//                 </button>
//               </nav>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1">
//           <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>

//           {/* Tabs */}
//           <div className="mb-6">
//             <div className="flex space-x-4 border-b border-gray-200">
//               <button
//                 onClick={() => setActiveTab("overview")}
//                 className={`pb-2 text-sm font-medium ${
//                   activeTab === "overview"
//                     ? "border-b-2 border-blue-500 text-blue-500"
//                     : "text-gray-500 hover:text-gray-700"
//                 }`}
//               >
//                 Overview
//               </button>
//               <button
//                 onClick={() => setActiveTab("bookings")}
//                 className={`pb-2 text-sm font-medium ${
//                   activeTab === "bookings"
//                     ? "border-b-2 border-blue-500 text-blue-500"
//                     : "text-gray-500 hover:text-gray-700"
//                 }`}
//               >
//                 Bookings
//               </button>
//               <button
//                 onClick={() => setActiveTab("wishlist")}
//                 className={`pb-2 text-sm font-medium ${
//                   activeTab === "wishlist"
//                     ? "border-b-2 border-blue-500 text-blue-500"
//                     : "text-gray-500 hover:text-gray-700"
//                 }`}
//               >
//                 Wishlist
//               </button>
//               <button
//                 onClick={() => setActiveTab("rewards")}
//                 className={`pb-2 text-sm font-medium ${
//                   activeTab === "rewards"
//                     ? "border-b-2 border-blue-500 text-blue-500"
//                     : "text-gray-500 hover:text-gray-700"
//                 }`}
//               >
//                 Rewards
//               </button>
//             </div>
//           </div>

//           {/* Tab Content */}
//           {activeTab === "overview" && (
//             <div>
//               {/* Upcoming Trip */}
//               <div className="bg-white rounded-lg border-1 border-gray-200 mb-6">
//                 <div className="p-6">
//                   <h2 className="text-xl font-bold mb-2">Upcoming Trip</h2>
//                   <p className="text-sm text-gray-500 mb-4">
//                     Your next adventure is just around the corner
//                   </p>
//                   <div className="flex flex-col md:flex-row gap-4">
//                     <div className="relative h-40 md:w-1/3 rounded-md overflow-hidden">
//                       <img
//                         src="https://www.leisurekart.com/blog/wp-content/uploads/2024/04/Places-to-visit-in-Mumbai.jpg"
//                         alt="Bali trip"
//                         fill
//                         className="object-cover w-full h-full"
//                       />
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="text-xl font-semibold mb-2">
//                         Bali Retreat Package
//                       </h3>
//                       <div className="grid grid-cols-2 gap-4 mb-4">
//                         <div className="flex items-center">
//                           <Calendar className="h-4 w-4 mr-2 text-gray-500" />
//                           <span className="text-sm">
//                             June 15 - June 22, 2025
//                           </span>
//                         </div>
//                         <div className="flex items-center">
//                           <MapPin className="h-4 w-4 mr-2 text-gray-500" />
//                           <span className="text-sm">Bali, Indonesia</span>
//                         </div>
//                         <div className="flex items-center">
//                           <Hotel className="h-4 w-4 mr-2 text-gray-500" />
//                           <span className="text-sm">Luxury Beach Resort</span>
//                         </div>
//                         <div className="flex items-center">
//                           <Plane className="h-4 w-4 mr-2 text-gray-500" />
//                           <span className="text-sm">Flight Included</span>
//                         </div>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <div className="text-sm text-gray-500">
//                           <Clock className="h-4 w-4 inline mr-1" />
//                           <span>Departing in 45 days</span>
//                         </div>
//                         <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg">
//                           View Details
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Recent Bookings */}
//               <div className="bg-white rounded-lg border-1 border-gray-200 mb-6">
//                 <div className="p-6">
//                   <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-4">
//                         <div className="relative h-12 w-12 rounded-md overflow-hidden">
//                           <img
//                             src="https://www.leisurekart.com/blog/wp-content/uploads/2024/04/Places-to-visit-in-Mumbai.jpg"
//                             alt="Paris"
//                             fill
//                             className="object-cover w-full h-full"
//                           />
//                         </div>
//                         <div>
//                           <h4 className="font-medium">Paris Weekend Getaway</h4>
//                           <p className="text-sm text-gray-500">
//                             April 10 - April 13, 2025
//                           </p>
//                         </div>
//                       </div>
//                       <button className="p-2 text-gray-500 hover:text-gray-700">
//                         <ChevronRight className="h-4 w-4" />
//                       </button>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-4">
//                         <div className="relative h-12 w-12 rounded-md overflow-hidden">
//                           <img
//                             src="https://www.leisurekart.com/blog/wp-content/uploads/2024/04/Places-to-visit-in-Mumbai.jpg"
//                             alt="New York"
//                             fill
//                             className="object-cover w-full h-full"
//                           />
//                         </div>
//                         <div>
//                           <h4 className="font-medium">
//                             New York City Explorer
//                           </h4>
//                           <p className="text-sm text-gray-500">
//                             March 5 - March 10, 2025
//                           </p>
//                         </div>
//                       </div>
//                       <button className="p-2 text-gray-500 hover:text-gray-700">
//                         <ChevronRight className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Recommended for You */}
//               <div className="bg-white rounded-lg border-1 border-gray-200">
//                 <div className="p-6">
//                   <h2 className="text-xl font-bold mb-4">
//                     Recommended for You
//                   </h2>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div className="flex gap-4">
//                       <div className="relative h-20 w-20 rounded-md overflow-hidden">
//                         <img
//                           src="https://www.leisurekart.com/blog/wp-content/uploads/2024/04/Places-to-visit-in-Mumbai.jpg"
//                           alt="Santorini"
//                           fill
//                           className="object-cover w-full h-full"
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <h4 className="font-medium">Santorini Escape</h4>
//                         <p className="text-sm text-gray-500 mb-1">
//                           7 days from $1,299
//                         </p>
//                         <button className="px-4 py-2 border border-gray-300 text-sm rounded-lg">
//                           View Deal
//                         </button>
//                       </div>
//                     </div>
//                     <div className="flex gap-4">
//                       <div className="relative h-20 w-20 rounded-md overflow-hidden">
//                         <img
//                           src="https://www.leisurekart.com/blog/wp-content/uploads/2024/04/Places-to-visit-in-Mumbai.jpg"
//                           alt="Maldives"
//                           fill
//                           className="object-cover w-full h-full"
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <h4 className="font-medium">Maldives Luxury</h4>
//                         <p className="text-sm text-gray-500 mb-1">
//                           10 days from $2,499
//                         </p>
//                         <button className="px-4 py-2 border border-gray-300 text-sm rounded-lg">
//                           View Deal
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === "bookings" && (
//             <div>
//               {/* Bookings Content */}
//               <div className="bg-white">
//                 <div>
//                   <h2 className="text-xl font-bold mb-4">My Bookings</h2>
//                   <div className="space-y-6">
//                     {/* Booking Item */}
//                     <div className="border rounded-lg p-4">
//                       <div className="flex flex-col md:flex-row gap-4 items-start">
//                         <div className="relative h-32 md:w-1/4 rounded-md overflow-hidden">
//                           <img
//                             src="https://www.leisurekart.com/blog/wp-content/uploads/2024/04/Places-to-visit-in-Mumbai.jpg"
//                             alt="Bali trip"
//                             fill
//                             className="object-cover"
//                           />
//                         </div>
//                         <div className="flex-1">
//                           <div className="flex justify-between items-start">
//                             <h3 className="text-xl font-semibold">
//                               Bali Retreat Package
//                             </h3>
//                             <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
//                               Confirmed
//                             </span>
//                           </div>
//                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2">
//                             <div className="flex items-center">
//                               <Calendar className="h-4 w-4 mr-2 text-gray-500" />
//                               <span className="text-sm">
//                                 June 15 - June 22, 2025
//                               </span>
//                             </div>
//                             <div className="flex items-center">
//                               <MapPin className="h-4 w-4 mr-2 text-gray-500" />
//                               <span className="text-sm">Bali, Indonesia</span>
//                             </div>
//                             <div className="flex items-center">
//                               <Hotel className="h-4 w-4 mr-2 text-gray-500" />
//                               <span className="text-sm">
//                                 Luxury Beach Resort
//                               </span>
//                             </div>
//                             <div className="flex items-center">
//                               <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
//                               <span className="text-sm">$2,199 (Paid)</span>
//                             </div>
//                           </div>
//                           <div className="flex flex-wrap gap-2 mt-4">
//                             <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg">
//                               View Details
//                             </button>
//                             <button className="px-4 py-2 border border-gray-300 text-sm rounded-lg">
//                               Modify
//                             </button>
//                             <button className="px-4 py-2 border border-gray-300 text-sm rounded-lg">
//                               Download Itinerary
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === "wishlist" && (
//             <div>
//               {/* Wishlist Content */}
//               <div className="bg-white rounded-lg">
//                 <div>
//                   <h2 className="text-xl font-bold mb-4">My Wishlist</h2>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Wishlist Item */}
//                     <div className="border rounded-lg overflow-hidden">
//                       <div className="relative h-40 w-full">
//                         <img
//                           src="https://www.leisurekart.com/blog/wp-content/uploads/2024/04/Places-to-visit-in-Mumbai.jpg"
//                           alt="Santorini"
//                           fill
//                           className="object-cover w-full h-full"
//                         />
//                         <button className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white/90 rounded-full">
//                           <Heart className="h-4 w-4 fill-red-500 text-red-500" />
//                         </button>
//                       </div>
//                       <div className="p-4">
//                         <h3 className="font-semibold mb-1">Santorini Escape</h3>
//                         <p className="text-sm text-gray-500 mb-2">
//                           7 days from $1,299
//                         </p>
//                         <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg">
//                           Book Now
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === "rewards" && (
//             <div>
//               {/* Rewards Content */}
//               <div className="bg-white">
//                 <div>
//                   <h2 className="text-xl font-bold mb-4">My Rewards</h2>
//                   <div className="mb-6">
//                     <div className="flex justify-between items-center mb-2">
//                       <h3 className="font-semibold">Current Points</h3>
//                       <span className="text-2xl font-bold text-blue-500">
//                         650
//                       </span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div
//                         className="bg-blue-500 h-2 rounded-full"
//                         style={{ width: `${progress}%` }}
//                       ></div>
//                     </div>
//                     <p className="text-sm text-gray-500 mt-2">
//                       You're 65% of the way to Gold status (1,000 points)
//                     </p>
//                   </div>

//                   <h3 className="font-semibold mb-4">Available Rewards</h3>
//                   <div className="space-y-4">
//                     {/* Reward Item */}
//                     <div className="border rounded-lg p-4">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <h4 className="font-medium">
//                             Free Airport Lounge Access
//                           </h4>
//                           <p className="text-sm text-gray-500">
//                             One-time access to premium airport lounges
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <span className="block font-bold text-blue-500">
//                             300 pts
//                           </span>
//                           <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg mt-2">
//                             Redeem
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }













// "use client";

// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import {
//   User,
//   Settings,
//   CreditCard,
//   Heart,
//   Clock,
//   Package,
//   Calendar,
//   MapPin,
//   ChevronRight,
//   LogOut,
//   Plane,
//   Hotel,
//   Globe,
//   Passport,
//   Home,
//   Save,
//   Edit,
//   Trash2,
//   ChevronDown,
//   X,
// } from "lucide-react";
// // import { useRouter } from "next/navigation";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { useNavigate } from "react-router-dom";


// export default function ProfilePage() {
//   const [progress, setProgress] = useState(65);
//   const [activeTab, setActiveTab] = useState("profile");
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [countries, setCountries] = useState([]);
//   const navigate = useNavigate();

//   const [showPassportSection, setShowPassportSection] = useState(false);
//   const [notification, setNotification] = useState({
//     show: false,
//     message: "",
//     type: "success",
//   });
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm();

//   useEffect(() => {
//     if (activeTab === "profile") {
//       fetchProfile();
//       fetchCountries();
//     }
//   }, [activeTab]);

//   const fetchProfile = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get("/api/profile", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setProfile(response.data.data);
      
//       // Set form values
//       if (response.data.data) {
//         const { user, customer } = response.data.data;
//         Object.keys(user).forEach((key) => setValue(key, user[key]));
//         Object.keys(customer.address).forEach((key) =>
//           setValue(`address.${key}`, customer.address[key])
//         );
//         Object.keys(customer.passport).forEach((key) =>
//           setValue(`passport.${key}`, customer.passport[key])
//         );
//         setValue("nationality", customer.nationality);
//         setValue(
//           "preferredDestinations",
//           customer.preferredDestinations?.join(", ") || ""
//         );
//       }
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching profile:", error);
//       setNotification({
//         show: true,
//         message: "Failed to load profile data",
//         type: "error",
//       });
//       setLoading(false);
//     }
//   };

//   const fetchCountries = async () => {
//     try {
//       const response = await axios.get("https://restcountries.com/v3.1/all");
//       setCountries(
//         response.data.map((country) => country.name.common).sort()
//       );
//     } catch (error) {
//       console.error("Error fetching countries:", error);
//     }
//   };

//   const onSubmit = async (data) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const formattedData = {
//         ...data,
//         preferredDestinations: data.preferredDestinations
//           ? data.preferredDestinations.split(",").map((item) => item.trim())
//           : [],
//       };

//       const response = await axios.post(
//         "/api/profile",
//         formattedData,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setNotification({
//         show: true,
//         message: "Profile saved successfully",
//         type: "success",
//       });
//       setEditMode(false);
//       fetchProfile();
//     } catch (error) {
//       console.error("Error saving profile:", error);
//       setNotification({
//         show: true,
//         message: error.response?.data?.message || "Failed to save profile",
//         type: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClearProfile = async () => {
//     if (
//       !window.confirm(
//         "Are you sure you want to clear all your profile data? This cannot be undone."
//       )
//     ) {
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       await axios.delete("/api/profile", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setNotification({
//         show: true,
//         message: "Profile data cleared successfully",
//         type: "success",
//       });
//       fetchProfile();
//     } catch (error) {
//       console.error("Error clearing profile:", error);
//       setNotification({
//         show: true,
//         message: "Failed to clear profile data",
//         type: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSignOut = () => {
//     localStorage.removeItem("token");
//     router.push("/login");
//   };

//   if (loading && !profile && activeTab === "profile") {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container py-8">
//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Sidebar */}
//         <div className="md:w-1/4">
//           <div className="bg-white rounded-lg border-1 border-gray-200 p-6">
//             <div className="text-center">
//               <div className="mx-auto relative w-24 h-24 mb-2">
//                 <img
//                   src="/placeholder.svg"
//                   alt="User profile"
//                   fill
//                   className="rounded-full object-cover"
//                 />
//               </div>
//               <h2 className="text-xl font-bold">
//                 {profile?.user?.firstName || "User"} {profile?.user?.lastName}
//               </h2>
//               <p className="text-sm text-gray-500">Premium Member</p>
//             </div>
//             <div className="mt-4">
//               <div className="space-y-1 mb-4">
//                 <div className="flex justify-between text-sm">
//                   <span>Loyalty Points</span>
//                   <span className="font-medium">650 / 1000</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div
//                     className="bg-blue-500 h-2 rounded-full"
//                     style={{ width: `${progress}%` }}
//                   ></div>
//                 </div>
//                 <p className="text-xs text-gray-500">
//                   Earn 350 more points for Gold status
//                 </p>
//               </div>

//               <nav className="space-y-1">
//                 <button
//                   onClick={() => setActiveTab("profile")}
//                   className={`flex items-center w-full p-2 text-sm rounded-lg ${
//                     activeTab === "profile"
//                       ? "bg-blue-50 text-blue-600"
//                       : "text-gray-700 hover:bg-gray-100"
//                   }`}
//                 >
//                   <User className="mr-2 h-4 w-4" />
//                   My Profile
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("bookings")}
//                   className={`flex items-center w-full p-2 text-sm rounded-lg ${
//                     activeTab === "bookings"
//                       ? "bg-blue-50 text-blue-600"
//                       : "text-gray-700 hover:bg-gray-100"
//                   }`}
//                 >
//                   <Calendar className="mr-2 h-4 w-4" />
//                   My Bookings
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("wishlist")}
//                   className={`flex items-center w-full p-2 text-sm rounded-lg ${
//                     activeTab === "wishlist"
//                       ? "bg-blue-50 text-blue-600"
//                       : "text-gray-700 hover:bg-gray-100"
//                   }`}
//                 >
//                   <Heart className="mr-2 h-4 w-4" />
//                   Wishlist
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("rewards")}
//                   className={`flex items-center w-full p-2 text-sm rounded-lg ${
//                     activeTab === "rewards"
//                       ? "bg-blue-50 text-blue-600"
//                       : "text-gray-700 hover:bg-gray-100"
//                   }`}
//                 >
//                   <Package className="mr-2 h-4 w-4" />
//                   Rewards
//                 </button>
//                 <button
//                   onClick={handleSignOut}
//                   className="flex items-center w-full p-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
//                 >
//                   <LogOut className="mr-2 h-4 w-4" />
//                   Sign Out
//                 </button>
//               </nav>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1">
//           <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>

//           {/* Profile Tab Content */}
//           {activeTab === "profile" && (
//             <div className="bg-white rounded-lg border-1 border-gray-200 p-6">
//               {/* Notification */}
//               {notification.show && (
//                 <div
//                   className={`mb-4 p-4 rounded-lg ${
//                     notification.type === "success"
//                       ? "bg-green-100 text-green-800"
//                       : "bg-red-100 text-red-800"
//                   }`}
//                 >
//                   <div className="flex justify-between items-center">
//                     <span>{notification.message}</span>
//                     <button
//                       onClick={() =>
//                         setNotification({ ...notification, show: false })
//                       }
//                       className="ml-4"
//                     >
//                       <X size={18} />
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Header with edit button */}
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-bold flex items-center">
//                   <User className="mr-2 h-5 w-5" />
//                   My Profile
//                 </h2>
//                 {!editMode ? (
//                   <button
//                     onClick={() => setEditMode(true)}
//                     className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//                   >
//                     <Edit className="mr-2 h-4 w-4" />
//                     Edit Profile
//                   </button>
//                 ) : (
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={handleSubmit(onSubmit)}
//                       className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
//                       disabled={loading}
//                     >
//                       {loading ? (
//                         <>
//                           <svg
//                             className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             ></circle>
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                             ></path>
//                           </svg>
//                           Saving...
//                         </>
//                       ) : (
//                         <>
//                           <Save className="mr-2 h-4 w-4" />
//                           Save Changes
//                         </>
//                       )}
//                     </button>
//                     <button
//                       onClick={() => setEditMode(false)}
//                       className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleClearProfile}
//                       className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
//                     >
//                       <Trash2 className="mr-2 h-4 w-4" />
//                       Clear Data
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <form onSubmit={handleSubmit(onSubmit)}>
//                 {/* Personal Information Section */}
//                 <div className="mb-8">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center">
//                     <User className="mr-2 h-5 w-5" />
//                     Personal Information
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         First Name
//                       </label>
//                       <input
//                         type="text"
//                         {...register("firstName", {
//                           required: "First name is required",
//                         })}
//                         className={`w-full px-3 py-2 border rounded-lg ${
//                           errors.firstName ? "border-red-500" : "border-gray-300"
//                         } ${!editMode ? "bg-gray-100" : ""}`}
//                         disabled={!editMode}
//                       />
//                       {errors.firstName && (
//                         <p className="mt-1 text-sm text-red-600">
//                           {errors.firstName.message}
//                         </p>
//                       )}
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Last Name
//                       </label>
//                       <input
//                         type="text"
//                         {...register("lastName", {
//                           required: "Last name is required",
//                         })}
//                         className={`w-full px-3 py-2 border rounded-lg ${
//                           errors.lastName ? "border-red-500" : "border-gray-300"
//                         } ${!editMode ? "bg-gray-100" : ""}`}
//                         disabled={!editMode}
//                       />
//                       {errors.lastName && (
//                         <p className="mt-1 text-sm text-red-600">
//                           {errors.lastName.message}
//                         </p>
//                       )}
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Date of Birth
//                       </label>
//                       <LocalizationProvider dateAdapter={AdapterDateFns}>
//                         <DatePicker
//                           value={watch("dateOfBirth") || null}
//                           onChange={(date) => setValue("dateOfBirth", date)}
//                           disabled={!editMode}
//                           slotProps={{
//                             textField: {
//                               fullWidth: true,
//                               variant: "outlined",
//                               error: !!errors.dateOfBirth,
//                               helperText: errors.dateOfBirth?.message,
//                               className: `${
//                                 !editMode ? "bg-gray-100" : ""
//                               } rounded-lg`,
//                             },
//                           }}
//                         />
//                       </LocalizationProvider>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Contact Information Section */}
//                 <div className="mb-8">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center">
//                     <Home className="mr-2 h-5 w-5" />
//                     Contact Information
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Phone Number
//                       </label>
//                       <input
//                         type="tel"
//                         {...register("phone", {
//                           required: "Phone number is required",
//                           pattern: {
//                             value: /^[0-9]{10,15}$/,
//                             message: "Invalid phone number",
//                           },
//                         })}
//                         className={`w-full px-3 py-2 border rounded-lg ${
//                           errors.phone ? "border-red-500" : "border-gray-300"
//                         } ${!editMode ? "bg-gray-100" : ""}`}
//                         disabled={!editMode}
//                       />
//                       {errors.phone && (
//                         <p className="mt-1 text-sm text-red-600">
//                           {errors.phone.message}
//                         </p>
//                       )}
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Alternate Phone
//                       </label>
//                       <input
//                         type="tel"
//                         {...register("alternatePhone", {
//                           pattern: {
//                             value: /^[0-9]{10,15}$/,
//                             message: "Invalid phone number",
//                           },
//                         })}
//                         className={`w-full px-3 py-2 border rounded-lg ${
//                           errors.alternatePhone ? "border-red-500" : "border-gray-300"
//                         } ${!editMode ? "bg-gray-100" : ""}`}
//                         disabled={!editMode}
//                       />
//                       {errors.alternatePhone && (
//                         <p className="mt-1 text-sm text-red-600">
//                           {errors.alternatePhone.message}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Address Section */}
//                 <div className="mb-8">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center">
//                     <MapPin className="mr-2 h-5 w-5" />
//                     Address
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Street Address
//                       </label>
//                       <input
//                         type="text"
//                         {...register("address.street")}
//                         className={`w-full px-3 py-2 border rounded-lg ${
//                           errors.address?.street ? "border-red-500" : "border-gray-300"
//                         } ${!editMode ? "bg-gray-100" : ""}`}
//                         disabled={!editMode}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         City
//                       </label>
//                       <input
//                         type="text"
//                         {...register("address.city")}
//                         className={`w-full px-3 py-2 border rounded-lg ${
//                           errors.address?.city ? "border-red-500" : "border-gray-300"
//                         } ${!editMode ? "bg-gray-100" : ""}`}
//                         disabled={!editMode}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         State/Province
//                       </label>
//                       <input
//                         type="text"
//                         {...register("address.state")}
//                         className={`w-full px-3 py-2 border rounded-lg ${
//                           errors.address?.state ? "border-red-500" : "border-gray-300"
//                         } ${!editMode ? "bg-gray-100" : ""}`}
//                         disabled={!editMode}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Country
//                       </label>
//                       <select
//                         {...register("address.country")}
//                         className={`w-full px-3 py-2 border rounded-lg ${
//                           errors.address?.country ? "border-red-500" : "border-gray-300"
//                         } ${!editMode ? "bg-gray-100" : ""}`}
//                         disabled={!editMode}
//                       >
//                         <option value="">Select Country</option>
//                         {countries.map((country) => (
//                           <option key={country} value={country}>
//                             {country}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         ZIP/Postal Code
//                       </label>
//                       <input
//                         type="text"
//                         {...register("address.zipCode")}
//                         className={`w-full px-3 py-2 border rounded-lg ${
//                           errors.address?.zipCode ? "border-red-500" : "border-gray-300"
//                         } ${!editMode ? "bg-gray-100" : ""}`}
//                         disabled={!editMode}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Travel Preferences Section */}
//                 <div className="mb-8">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center">
//                     <Plane className="mr-2 h-5 w-5" />
//                     Travel Preferences
//                   </h3>
//                   <div className="grid grid-cols-1 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Nationality
//                       </label>
//                       <select
//                         {...register("nationality")}
//                         className={`w-full px-3 py-2 border rounded-lg ${
//                           errors.nationality ? "border-red-500" : "border-gray-300"
//                         } ${!editMode ? "bg-gray-100" : ""}`}
//                         disabled={!editMode}
//                       >
//                         <option value="">Select Nationality</option>
//                         {countries.map((country) => (
//                           <option key={country} value={country}>
//                             {country}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Preferred Destinations (comma separated)
//                       </label>
//                       <input
//                         type="text"
//                         {...register("preferredDestinations")}
//                         className={`w-full px-3 py-2 border rounded-lg ${
//                           errors.preferredDestinations ? "border-red-500" : "border-gray-300"
//                         } ${!editMode ? "bg-gray-100" : ""}`}
//                         disabled={!editMode}
//                         placeholder="e.g., France, Japan, Australia"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Passport Section */}
//                 <div className="mb-8">
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-lg font-semibold flex items-center">
//                       <Passport className="mr-2 h-5 w-5" />
//                       Passport Information
//                     </h3>
//                     <button
//                       type="button"
//                       onClick={() => setShowPassportSection(!showPassportSection)}
//                       className="flex items-center text-sm text-blue-500"
//                     >
//                       {showPassportSection ? "Hide" : "Show"} Passport Details
//                       <ChevronDown
//                         className={`ml-1 h-4 w-4 transition-transform ${
//                           showPassportSection ? "rotate-180" : ""
//                         }`}
//                       />
//                     </button>
//                   </div>

//                   {showPassportSection && (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Passport Number
//                         </label>
//                         <input
//                           type="text"
//                           {...register("passport.passportNumber", {
//                             required: "Passport number is required",
//                           })}
//                           className={`w-full px-3 py-2 border rounded-lg ${
//                             errors.passport?.passportNumber
//                               ? "border-red-500"
//                               : "border-gray-300"
//                           } ${!editMode ? "bg-gray-100" : ""}`}
//                           disabled={!editMode}
//                         />
//                         {errors.passport?.passportNumber && (
//                           <p className="mt-1 text-sm text-red-600">
//                             {errors.passport.passportNumber.message}
//                           </p>
//                         )}
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Country of Issue
//                         </label>
//                         <select
//                           {...register("passport.countryOfIssue", {
//                             required: "Country of issue is required",
//                           })}
//                           className={`w-full px-3 py-2 border rounded-lg ${
//                             errors.passport?.countryOfIssue
//                               ? "border-red-500"
//                               : "border-gray-300"
//                           } ${!editMode ? "bg-gray-100" : ""}`}
//                           disabled={!editMode}
//                         >
//                           <option value="">Select Country</option>
//                           {countries.map((country) => (
//                             <option key={country} value={country}>
//                               {country}
//                             </option>
//                           ))}
//                         </select>
//                         {errors.passport?.countryOfIssue && (
//                           <p className="mt-1 text-sm text-red-600">
//                             {errors.passport.countryOfIssue.message}
//                           </p>
//                         )}
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Date of Issue
//                         </label>
//                         <LocalizationProvider dateAdapter={AdapterDateFns}>
//                           <DatePicker
//                             value={watch("passport.dateOfIssue") || null}
//                             onChange={(date) =>
//                               setValue("passport.dateOfIssue", date)
//                             }
//                             disabled={!editMode}
//                             slotProps={{
//                               textField: {
//                                 fullWidth: true,
//                                 variant: "outlined",
//                                 error: !!errors.passport?.dateOfIssue,
//                                 helperText: errors.passport?.dateOfIssue?.message,
//                                 className: `${
//                                   !editMode ? "bg-gray-100" : ""
//                                 } rounded-lg`,
//                               },
//                             }}
//                           />
//                         </LocalizationProvider>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Date of Expiry
//                         </label>
//                         <LocalizationProvider dateAdapter={AdapterDateFns}>
//                           <DatePicker
//                             value={watch("passport.dateOfExpiry") || null}
//                             onChange={(date) =>
//                               setValue("passport.dateOfExpiry", date)
//                             }
//                             disabled={!editMode}
//                             slotProps={{
//                               textField: {
//                                 fullWidth: true,
//                                 variant: "outlined",
//                                 error: !!errors.passport?.dateOfExpiry,
//                                 helperText: errors.passport?.dateOfExpiry?.message,
//                                 className: `${
//                                   !editMode ? "bg-gray-100" : ""
//                                 } rounded-lg`,
//                               },
//                             }}
//                           />
//                         </LocalizationProvider>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Place of Issue
//                         </label>
//                         <input
//                           type="text"
//                           {...register("passport.placeOfIssue")}
//                           className={`w-full px-3 py-2 border rounded-lg ${
//                             errors.passport?.placeOfIssue
//                               ? "border-red-500"
//                               : "border-gray-300"
//                           } ${!editMode ? "bg-gray-100" : ""}`}
//                           disabled={!editMode}
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Nationality (on passport)
//                         </label>
//                         <select
//                           {...register("passport.nationality")}
//                           className={`w-full px-3 py-2 border rounded-lg ${
//                             errors.passport?.nationality
//                               ? "border-red-500"
//                               : "border-gray-300"
//                           } ${!editMode ? "bg-gray-100" : ""}`}
//                           disabled={!editMode}
//                         >
//                           <option value="">Select Nationality</option>
//                           {countries.map((country) => (
//                             <option key={country} value={country}>
//                               {country}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </form>
//             </div>
//           )}

//           {/* Other Tabs */}
//           {activeTab === "bookings" && (
//             <div>
//               {/* Bookings Content */}
//               <div className="bg-white">
//                 <div>
//                   <h2 className="text-xl font-bold mb-4">My Bookings</h2>
//                   <div className="space-y-6">
//                     {/* Booking Item */}
//                     <div className="border rounded-lg p-4">
//                       <div className="flex flex-col md:flex-row gap-4 items-start">
//                         <div className="relative h-32 md:w-1/4 rounded-md overflow-hidden">
//                           <img
//                             src="https://www.leisurekart.com/blog/wp-content/uploads/2024/04/Places-to-visit-in-Mumbai.jpg"
//                             alt="Bali trip"
//                             fill
//                             className="object-cover"
//                           />
//                         </div>
//                         <div className="flex-1">
//                           <div className="flex justify-between items-start">
//                             <h3 className="text-xl font-semibold">
//                               Bali Retreat Package
//                             </h3>
//                             <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
//                               Confirmed
//                             </span>
//                           </div>
//                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2">
//                             <div className="flex items-center">
//                               <Calendar className="h-4 w-4 mr-2 text-gray-500" />
//                               <span className="text-sm">
//                                 June 15 - June 22, 2025
//                               </span>
//                             </div>
//                             <div className="flex items-center">
//                               <MapPin className="h-4 w-4 mr-2 text-gray-500" />
//                               <span className="text-sm">Bali, Indonesia</span>
//                             </div>
//                             <div className="flex items-center">
//                               <Hotel className="h-4 w-4 mr-2 text-gray-500" />
//                               <span className="text-sm">
//                                 Luxury Beach Resort
//                               </span>
//                             </div>
//                             <div className="flex items-center">
//                               <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
//                               <span className="text-sm">$2,199 (Paid)</span>
//                             </div>
//                           </div>
//                           <div className="flex flex-wrap gap-2 mt-4">
//                             <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg">
//                               View Details
//                             </button>
//                             <button className="px-4 py-2 border border-gray-300 text-sm rounded-lg">
//                               Modify
//                             </button>
//                             <button className="px-4 py-2 border border-gray-300 text-sm rounded-lg">
//                               Download Itinerary
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === "wishlist" && (
//             <div>
//               {/* Wishlist Content */}
//               <div className="bg-white rounded-lg">
//                 <div>
//                   <h2 className="text-xl font-bold mb-4">My Wishlist</h2>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Wishlist Item */}
//                     <div className="border rounded-lg overflow-hidden">
//                       <div className="relative h-40 w-full">
//                         <img
//                           src="https://www.leisurekart.com/blog/wp-content/uploads/2024/04/Places-to-visit-in-Mumbai.jpg"
//                           alt="Santorini"
//                           fill
//                           className="object-cover w-full h-full"
//                         />
//                         <button className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white/90 rounded-full">
//                           <Heart className="h-4 w-4 fill-red-500 text-red-500" />
//                         </button>
//                       </div>
//                       <div className="p-4">
//                         <h3 className="font-semibold mb-1">Santorini Escape</h3>
//                         <p className="text-sm text-gray-500 mb-2">
//                           7 days from $1,299
//                         </p>
//                         <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg">
//                           Book Now
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === "rewards" && (
//             <div>
//               {/* Rewards Content */}
//               <div className="bg-white">
//                 <div>
//                   <h2 className="text-xl font-bold mb-4">My Rewards</h2>
//                   <div className="mb-6">
//                     <div className="flex justify-between items-center mb-2">
//                       <h3 className="font-semibold">Current Points</h3>
//                       <span className="text-2xl font-bold text-blue-500">
//                         650
//                       </span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div
//                         className="bg-blue-500 h-2 rounded-full"
//                         style={{ width: `${progress}%` }}
//                       ></div>
//                     </div>
//                     <p className="text-sm text-gray-500 mt-2">
//                       You're 65% of the way to Gold status (1,000 points)
//                     </p>
//                   </div>

//                   <h3 className="font-semibold mb-4">Available Rewards</h3>
//                   <div className="space-y-4">
//                     {/* Reward Item */}
//                     <div className="border rounded-lg p-4">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <h4 className="font-medium">
//                             Free Airport Lounge Access
//                           </h4>
//                           <p className="text-sm text-gray-500">
//                             One-time access to premium airport lounges
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <span className="block font-bold text-blue-500">
//                             300 pts
//                           </span>
//                           <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg mt-2">
//                             Redeem
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }











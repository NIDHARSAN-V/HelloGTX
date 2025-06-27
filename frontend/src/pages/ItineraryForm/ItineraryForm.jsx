import { useState } from "react";
import { FiCalendar, FiPlus, FiSave } from "react-icons/fi";

import "./ItineraryForm.css";

function ItineraryForm() {
  const [activeTab, setActiveTab] = useState("basic");
  const [TravelPlan, setTravelPlan] = useState({
    QueryDetails: {
      code: "",
      No_of_Nights: 0,
      Start_City: "",
      Destination_Covered: [],
      Total_Guest: 0,
      Child: 0,
      Start_Date: "",
      End_Date: "",
    },

    Package: {
      Package_Name: "",
      Plan: [],
    },

    Price_Details: [],

    Itinerary_Details: {
      Description: "",
      Days: [],
    },

    Inclusions: [],
    Exclusions: [],
    PaymentOption: {
      Description: "",
      Account_Name: "",
      Bank_Name: "",
      Branch: "",
      Account_Number: 0,
      Disclaimer: "",
    },

    Booking_Terms: [
      "50 advance to be paid at the time of booking.",
      "Air fair is calculated at the time of proposal creation and is subject to change at the time of booking.",
      "100 payment is to be made for domestic packages before 4 days of departure date.",
      "100 payment is to be made for international packages before 7 days of departure date.",
      "In case of cancellation standard cancellation policies will be applicable or may be changed as per the policies.",
    ],

    General_Information: [
      "ID Proof any Passport (For International Travel)",
      "Water Bottle with a Filtering System",
      "Daily Medications",
      "Phone Chargers",
      "Camera",
      "ID Proof",
      "Toilet Papers",
      "Walking Shoes",
      "Ear Phones",
      "Cap",
      "Power Bank",
      "Sun Screen Lotion",
      "Wipes",
      "Ladies Basics",
      "Mosquito Cream/bands/net depending upon your itinerary.",
    ],

    Cancellation_Policy: [
      "30 days or more before date of departure: 25% of total cost",
      "29 - 20 days before date of departure: 50% of total cost",
      "19 days or less before date of departure: 100% of total cost",
    ],

    Terms_And_Conditions: [
      "In case client wishes to prepone/postpone his or her travel dates, we request you to kindly reach us 15 days prior to journey date via e-mail/SMS.",
      "The customers can prepone/postpone their tour once without any additional charges (if intimated before 15 days of travel date in written).",
      "However postponing & preponing second time will attract additional charges.",
      "Also note that few service providers (Hoteliers, Transporter etc.) may apply postpone/prepone charges even after meeting above requirement.",
      "In such cases postpone/prepone charges will be deducted from the advance amount deposited.",
      "In all prepone or postpone scenarios, the services and the costing will be subject to availability of Hotel/Volvo and season/offseason time.",
      "We do not accept any changes in plan within 15 days of travel date.",
      "However in rare cases like adverse climatic conditions or strikes, package can be postponed which will be intimated to you beforehand.",
      "The validity to utilize your advance payment in prepone/postpone scenarios is 1 Year from the date of advance payment.",
      "The advance payment and the invoice Number allotted to you, are transferable i.e. you can pass on your booking to any of your friends/relatives.",
      "(Please Note: In order to transfer your booking you must meet the above terms and conditions first).",
    ],
  });

  // Function to handle adding new entries
  const addDestination = () => {
    setTravelPlan((prev) => ({
      ...prev,
      QueryDetails: {
        ...prev.QueryDetails,
        Destination_Covered: [...prev.QueryDetails.Destination_Covered, ""],
      },
    }));
  };

  const addPlan = () => {
    setTravelPlan((prev) => ({
      ...prev,
      Package: {
        ...prev.Package,
        Plan: [
          ...prev.Package.Plan,
          {
            City: "",
            Hotel_Name: "",
            Check_In_Out_Date: "",
            Nights: 0,
            Room_Type: "",
            Meal_Plan: "",
            Rooms: 0,
            Adult: 2,
            Child: "",
          },
        ],
      },
    }));
  };

  const addPriceDetail = () => {
    setTravelPlan((prev) => ({
      ...prev,
      Price_Details: [
        ...prev.Price_Details,
        {
          Pax_Type: "",
          No_Of_Pax: 0,
          Cost_Per_Person: 0,
          Total_Cost: 0,
        },
      ],
    }));
  };

  const addDay = () => {
    setTravelPlan((prev) => ({
      ...prev,
      Itinerary_Details: {
        ...prev.Itinerary_Details,
        Days: [
          ...prev.Itinerary_Details.Days,
          {
            Day: prev.Itinerary_Details.Days.length + 1,
            Date: "",
            Img: "",
            Exp_Description: "",
            Desc_Points: [],
            SightSeeing_Included: "",
            Meal: [],
            Transfers: "",
          },
        ],
      },
    }));
  };

  const addBookingTerm = () => {
    setTravelPlan((prev) => ({
      ...prev,
      Booking_Terms: [...prev.Booking_Terms, ""],
    }));
  };

  const addCancellationPolicy = () => {
    setTravelPlan((prev) => ({
      ...prev,
      Cancellation_Policy: [...prev.Cancellation_Policy, ""],
    }));
  };

  const addTermsAndConditions = () => {
    setTravelPlan((prev) => ({
      ...prev,
      Terms_And_Conditions: [...prev.Terms_And_Conditions, ""],
    }));
  };

  // Add a new function to handle PDF generation and download
  const handleSaveItinerary = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Please allow popups to download the PDF");
      return;
    }

    // Generate HTML content for the PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Itinerary: ${TravelPlan.Package.Package_Name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1, h2, h3 {
              color: #4361ee;
            }
            h1 {
              text-align: center;
              border-bottom: 2px solid #4361ee;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            h2 {
              margin-top: 30px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            .section {
              margin-bottom: 30px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px 12px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
            }
            .list-item {
              margin-bottom: 8px;
              padding-left: 20px;
              position: relative;
            }
            .list-item:before {
              content: "•";
              position: absolute;
              left: 0;
              color: #4361ee;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <h1>Itinerary: ${
            TravelPlan.Package.Package_Name || "New Travel Package"
          }</h1>
          
          <div class="section">
            <h2>Basic Information</h2>
            <table>
              <tr>
                <th>Start City</th>
                <td>${TravelPlan.QueryDetails.Start_City || "N/A"}</td>
                <th>Total Guests</th>
                <td>${TravelPlan.QueryDetails.Total_Guest || 0} (Adults: ${
      TravelPlan.QueryDetails.Total_Guest - TravelPlan.QueryDetails.Child || 0
    }, Children: ${TravelPlan.QueryDetails.Child || 0})</td>
              </tr>
              <tr>
                <th>Start Date</th>
                <td>${TravelPlan.QueryDetails.Start_Date || "N/A"}</td>
                <th>End Date</th>
                <td>${TravelPlan.QueryDetails.End_Date || "N/A"}</td>
              </tr>
            </table>
            
            <h3>Destinations Covered</h3>
            <div>
              ${TravelPlan.QueryDetails.Destination_Covered.map(
                (dest) => `<div class="list-item">${dest}</div>`
              ).join("")}
            </div>
          </div>
          
          <div class="section">
            <h2>Package Plan</h2>
            ${TravelPlan.Package.Plan.map(
              (plan, index) => `
              <h3>Plan ${index + 1}: ${plan.City || "N/A"}</h3>
              <table>
                <tr>
                  <th>Hotel</th>
                  <td>${plan.Hotel_Name || "N/A"}</td>
                  <th>Check In/Out</th>
                  <td>${plan.Check_In_Out_Date || "N/A"}</td>
                </tr>
                <tr>
                  <th>Nights</th>
                  <td>${plan.Nights || 0}</td>
                  <th>Room Type</th>
                  <td>${plan.Room_Type || "N/A"}</td>
                </tr>
                <tr>
                  <th>Meal Plan</th>
                  <td>${plan.Meal_Plan || "N/A"}</td>
                  <th>Rooms/Guests</th>
                  <td>${plan.Rooms || 0} rooms, ${plan.Adult || 0} adults, ${
                plan.Child || 0
              } children</td>
                </tr>
              </table>
            `
            ).join("")}
          </div>
          
          <div class="section">
            <h2>Price Details</h2>
            <table>
              <tr>
                <th>Type</th>
                <th>Number of Pax</th>
                <th>Cost Per Person</th>
                <th>Total Cost</th>
              </tr>
              ${TravelPlan.Price_Details.map(
                (price) => `
                <tr>
                  <td>${price.Pax_Type || "N/A"}</td>
                  <td>${price.No_Of_Pax || 0}</td>
                  <td>₹${price.Cost_Per_Person || 0}</td>
                  <td>₹${price.Total_Cost || 0}</td>
                </tr>
              `
              ).join("")}
            </table>
          </div>
          
          <div class="section">
            <h2>Itinerary Details</h2>
            <p>${
              TravelPlan.Itinerary_Details.Description ||
              "No description provided."
            }</p>
            
            ${TravelPlan.Itinerary_Details.Days.map(
              (day) => `
              <h3>Day ${day.Day}: ${
                new Date(day.Date).toLocaleDateString() || "N/A"
              }</h3>
              <p><strong>Experience:</strong> ${
                day.Exp_Description || "N/A"
              }</p>
              <p><strong>Sightseeing:</strong> ${
                day.SightSeeing_Included || "N/A"
              }</p>
              <p><strong>Transfers:</strong> ${day.Transfers || "N/A"}</p>
            `
            ).join("")}
          </div>
          
          <div class="section">
            <h2>Booking Terms</h2>
            ${TravelPlan.Booking_Terms.map(
              (term) => `<div class="list-item">${term}</div>`
            ).join("")}
          </div>
          
          <div class="section">
            <h2>Cancellation Policy</h2>
            ${TravelPlan.Cancellation_Policy.map(
              (policy) => `<div class="list-item">${policy}</div>`
            ).join("")}
          </div>
          
          <div class="section">
            <h2>Terms & Conditions</h2>
            ${TravelPlan.Terms_And_Conditions.map(
              (term) => `<div class="list-item">${term}</div>`
            ).join("")}
          </div>
          
          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()} | ${
      TravelPlan.Package.Package_Name || "Travel Itinerary"
    }</p>
          </div>
        </body>
      </html>
    `;

    // Write the HTML content to the new window
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load before printing
    printWindow.onload = () => {
      // Trigger print dialog
      printWindow.print();

      // Close the window after printing (most browsers will do this automatically when user cancels or finishes printing)
      // Some browsers may keep it open, which is fine as the user can close it
    };
  };

  return (
    <div className="itinerary-container">
      <div className="itinerary-card">
        <div className="itinerary-card-header">
          <h2 className="itinerary-card-title">
            <FiCalendar className="icon" />
            Create New Itinerary
          </h2>
        </div>
        <div className="itinerary-card-content">
          <div className="tabs">
            <div className="tabs-list">
              <button
                className={`tab-trigger ${
                  activeTab === "basic" ? "active" : ""
                }`}
                onClick={() => setActiveTab("basic")}
              >
                Basic Info
              </button>
              <button
                className={`tab-trigger ${
                  activeTab === "package" ? "active" : ""
                }`}
                onClick={() => setActiveTab("package")}
              >
                Package Plan
              </button>
              <button
                className={`tab-trigger ${
                  activeTab === "pricing" ? "active" : ""
                }`}
                onClick={() => setActiveTab("pricing")}
              >
                Pricing
              </button>
              <button
                className={`tab-trigger ${
                  activeTab === "itinerary" ? "active" : ""
                }`}
                onClick={() => setActiveTab("itinerary")}
              >
                Itinerary
              </button>
              <button
                className={`tab-trigger ${
                  activeTab === "terms" ? "active" : ""
                }`}
                onClick={() => setActiveTab("terms")}
              >
                Terms & Policies
              </button>
            </div>

            {/* Basic Info Tab */}
            <div
              className={`tab-content ${activeTab === "basic" ? "active" : ""}`}
            >
              <div className="form-grid">
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="package-name" className="form-label">
                      Package Name
                    </label>
                    <input
                      id="package-name"
                      className="form-input"
                      value={TravelPlan.Package.Package_Name}
                      onChange={(e) =>
                        setTravelPlan({
                          ...TravelPlan,
                          Package: {
                            ...TravelPlan.Package,
                            Package_Name: e.target.value,
                          },
                        })
                      }
                      placeholder="Enter package name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="start-city" className="form-label">
                      Start City
                    </label>
                    <input
                      id="start-city"
                      className="form-input"
                      value={TravelPlan.QueryDetails.Start_City}
                      onChange={(e) =>
                        setTravelPlan((prev) => ({
                          ...prev,
                          QueryDetails: {
                            ...prev.QueryDetails,
                            Start_City: e.target.value,
                          },
                        }))
                      }
                      placeholder="Enter starting city"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="total-guests" className="form-label">
                        Total Guests
                      </label>
                      <input
                        id="total-guests"
                        type="number"
                        className="form-input"
                        value={TravelPlan.QueryDetails.Total_Guest}
                        onChange={(e) =>
                          setTravelPlan((prev) => ({
                            ...prev,
                            QueryDetails: {
                              ...prev.QueryDetails,
                              Total_Guest: Number.parseInt(e.target.value),
                            },
                          }))
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="children" className="form-label">
                        Children
                      </label>
                      <input
                        id="children"
                        type="number"
                        className="form-input"
                        value={TravelPlan.QueryDetails.Child}
                        onChange={(e) =>
                          setTravelPlan((prev) => ({
                            ...prev,
                            QueryDetails: {
                              ...prev.QueryDetails,
                              Child: Number.parseInt(e.target.value),
                            },
                          }))
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="start-date" className="form-label">
                        Start Date
                      </label>
                      <input
                        id="start-date"
                        type="date"
                        className="form-input"
                        value={TravelPlan.QueryDetails.Start_Date}
                        onChange={(e) =>
                          setTravelPlan((prev) => ({
                            ...prev,
                            QueryDetails: {
                              ...prev.QueryDetails,
                              Start_Date: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="end-date" className="form-label">
                        End Date
                      </label>
                      <input
                        id="end-date"
                        type="date"
                        className="form-input"
                        value={TravelPlan.QueryDetails.End_Date}
                        onChange={(e) =>
                          setTravelPlan((prev) => ({
                            ...prev,
                            QueryDetails: {
                              ...prev.QueryDetails,
                              End_Date: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="form-column">
                  <label className="form-label">Destinations Covered</label>
                  <div className="scrollable-container">
                    {TravelPlan.QueryDetails.Destination_Covered.map(
                      (destination, index) => (
                        <input
                          key={index}
                          className="form-input"
                          value={destination}
                          onChange={(e) => {
                            const updated = [
                              ...TravelPlan.QueryDetails.Destination_Covered,
                            ];
                            updated[index] = e.target.value;
                            setTravelPlan((prev) => ({
                              ...prev,
                              QueryDetails: {
                                ...prev.QueryDetails,
                                Destination_Covered: updated,
                              },
                            }));
                          }}
                          placeholder={`Destination ${index + 1}`}
                        />
                      )
                    )}
                    <button
                      onClick={addDestination}
                      className="btn btn-outline"
                    >
                      <FiPlus className="icon-sm" /> Add Destination
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Plan Tab */}
            <div
              className={`tab-content ${
                activeTab === "package" ? "active" : ""
              }`}
            >
              <div className="form-stack">
                {TravelPlan.Package.Plan.map((plan, index) => (
                  <div key={index} className="card">
                    <div className="card-header">
                      <h3 className="card-title">Plan {index + 1}</h3>
                    </div>
                    <div className="card-content">
                      <div className="form-grid-3">
                        <div className="form-group">
                          <label
                            htmlFor={`city-${index}`}
                            className="form-label-sm"
                          >
                            City
                          </label>
                          <input
                            id={`city-${index}`}
                            className="form-input"
                            value={plan.City}
                            onChange={(e) => {
                              const updated = [...TravelPlan.Package.Plan];
                              updated[index].City = e.target.value;
                              setTravelPlan((prev) => ({
                                ...prev,
                                Package: { ...prev.Package, Plan: updated },
                              }));
                            }}
                            placeholder="City name"
                          />
                        </div>
                        <div className="form-group">
                          <label
                            htmlFor={`hotel-${index}`}
                            className="form-label-sm"
                          >
                            Hotel Name
                          </label>
                          <input
                            id={`hotel-${index}`}
                            className="form-input"
                            value={plan.Hotel_Name}
                            onChange={(e) => {
                              const updated = [...TravelPlan.Package.Plan];
                              updated[index].Hotel_Name = e.target.value;
                              setTravelPlan((prev) => ({
                                ...prev,
                                Package: { ...prev.Package, Plan: updated },
                              }));
                            }}
                            placeholder="Hotel name"
                          />
                        </div>
                        <div className="form-group">
                          <label
                            htmlFor={`dates-${index}`}
                            className="form-label-sm"
                          >
                            Check In/Out Dates
                          </label>
                          <input
                            id={`dates-${index}`}
                            className="form-input"
                            value={plan.Check_In_Out_Date}
                            onChange={(e) => {
                              const updated = [...TravelPlan.Package.Plan];
                              updated[index].Check_In_Out_Date = e.target.value;
                              setTravelPlan((prev) => ({
                                ...prev,
                                Package: { ...prev.Package, Plan: updated },
                              }));
                            }}
                            placeholder="e.g., Mar 15-18, 2025"
                          />
                        </div>
                        <div className="form-group">
                          <label
                            htmlFor={`nights-${index}`}
                            className="form-label-sm"
                          >
                            Nights
                          </label>
                          <input
                            id={`nights-${index}`}
                            type="number"
                            className="form-input"
                            value={plan.Nights}
                            onChange={(e) => {
                              const updated = [...TravelPlan.Package.Plan];
                              updated[index].Nights = Number.parseInt(
                                e.target.value
                              );
                              setTravelPlan((prev) => ({
                                ...prev,
                                Package: { ...prev.Package, Plan: updated },
                              }));
                            }}
                            placeholder="0"
                          />
                        </div>
                        <div className="form-group">
                          <label
                            htmlFor={`room-type-${index}`}
                            className="form-label-sm"
                          >
                            Room Type
                          </label>
                          <input
                            id={`room-type-${index}`}
                            className="form-input"
                            value={plan.Room_Type}
                            onChange={(e) => {
                              const updated = [...TravelPlan.Package.Plan];
                              updated[index].Room_Type = e.target.value;
                              setTravelPlan((prev) => ({
                                ...prev,
                                Package: { ...prev.Package, Plan: updated },
                              }));
                            }}
                            placeholder="e.g., Deluxe, Suite"
                          />
                        </div>
                        <div className="form-group">
                          <label
                            htmlFor={`meal-plan-${index}`}
                            className="form-label-sm"
                          >
                            Meal Plan
                          </label>
                          <input
                            id={`meal-plan-${index}`}
                            className="form-input"
                            value={plan.Meal_Plan}
                            onChange={(e) => {
                              const updated = [...TravelPlan.Package.Plan];
                              updated[index].Meal_Plan = e.target.value;
                              setTravelPlan((prev) => ({
                                ...prev,
                                Package: { ...prev.Package, Plan: updated },
                              }));
                            }}
                            placeholder="e.g., Breakfast, All-inclusive"
                          />
                        </div>
                        <div className="form-group">
                          <label
                            htmlFor={`rooms-${index}`}
                            className="form-label-sm"
                          >
                            Rooms
                          </label>
                          <input
                            id={`rooms-${index}`}
                            type="number"
                            className="form-input"
                            value={plan.Rooms}
                            onChange={(e) => {
                              const updated = [...TravelPlan.Package.Plan];
                              updated[index].Rooms = Number.parseInt(
                                e.target.value
                              );
                              setTravelPlan((prev) => ({
                                ...prev,
                                Package: { ...prev.Package, Plan: updated },
                              }));
                            }}
                            placeholder="0"
                          />
                        </div>
                        <div className="form-group">
                          <label
                            htmlFor={`adults-${index}`}
                            className="form-label-sm"
                          >
                            Adults
                          </label>
                          <input
                            id={`adults-${index}`}
                            type="number"
                            className="form-input"
                            value={plan.Adult}
                            onChange={(e) => {
                              const updated = [...TravelPlan.Package.Plan];
                              updated[index].Adult = Number.parseInt(
                                e.target.value
                              );
                              setTravelPlan((prev) => ({
                                ...prev,
                                Package: { ...prev.Package, Plan: updated },
                              }));
                            }}
                            placeholder="0"
                          />
                        </div>
                        <div className="form-group">
                          <label
                            htmlFor={`children-${index}`}
                            className="form-label-sm"
                          >
                            Children
                          </label>
                          <input
                            id={`children-${index}`}
                            className="form-input"
                            value={plan.Child}
                            onChange={(e) => {
                              const updated = [...TravelPlan.Package.Plan];
                              updated[index].Child = e.target.value;
                              setTravelPlan((prev) => ({
                                ...prev,
                                Package: { ...prev.Package, Plan: updated },
                              }));
                            }}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addPlan} className="btn btn-outline">
                  <FiPlus className="icon-sm" /> Add Plan
                </button>
              </div>
            </div>

            {/* Pricing Tab */}
            <div
              className={`tab-content ${
                activeTab === "pricing" ? "active" : ""
              }`}
            >
              <div className="form-stack">
                {TravelPlan.Price_Details.map((price, index) => (
                  <div key={index} className="card">
                    <div className="card-header">
                      <h3 className="card-title">Price Option {index + 1}</h3>
                    </div>
                    <div className="card-content">
                      <div className="form-grid-2">
                        <div className="form-group">
                          <label
                            htmlFor={`pax-type-${index}`}
                            className="form-label-sm"
                          >
                            Pax Type
                          </label>
                          <input
                            id={`pax-type-${index}`}
                            className="form-input"
                            value={price.Pax_Type}
                            onChange={(e) => {
                              const updated = [...TravelPlan.Price_Details];
                              updated[index].Pax_Type = e.target.value;
                              setTravelPlan((prev) => ({
                                ...prev,
                                Price_Details: updated,
                              }));
                            }}
                            placeholder="e.g., Adult, Child, Senior"
                          />
                        </div>
                        <div className="form-group">
                          <label
                            htmlFor={`no-of-pax-${index}`}
                            className="form-label-sm"
                          >
                            Number of Pax
                          </label>
                          <input
                            id={`no-of-pax-${index}`}
                            type="number"
                            className="form-input"
                            value={price.No_Of_Pax}
                            onChange={(e) => {
                              const updated = [...TravelPlan.Price_Details];
                              updated[index].No_Of_Pax = Number.parseInt(
                                e.target.value
                              );
                              setTravelPlan((prev) => ({
                                ...prev,
                                Price_Details: updated,
                              }));
                            }}
                            placeholder="0"
                          />
                        </div>
                        <div className="form-group">
                          <label
                            htmlFor={`cost-per-person-${index}`}
                            className="form-label-sm"
                          >
                            Cost Per Person
                          </label>
                          <input
                            id={`cost-per-person-${index}`}
                            type="number"
                            className="form-input"
                            value={price.Cost_Per_Person}
                            onChange={(e) => {
                              const updated = [...TravelPlan.Price_Details];
                              updated[index].Cost_Per_Person = Number.parseInt(
                                e.target.value
                              );
                              setTravelPlan((prev) => ({
                                ...prev,
                                Price_Details: updated,
                              }));
                            }}
                            placeholder="0"
                          />
                        </div>
                        <div className="form-group">
                          <label
                            htmlFor={`total-cost-${index}`}
                            className="form-label-sm"
                          >
                            Total Cost
                          </label>
                          <input
                            id={`total-cost-${index}`}
                            type="number"
                            className="form-input"
                            value={price.Total_Cost}
                            onChange={(e) => {
                              const updated = [...TravelPlan.Price_Details];
                              updated[index].Total_Cost = Number.parseInt(
                                e.target.value
                              );
                              setTravelPlan((prev) => ({
                                ...prev,
                                Price_Details: updated,
                              }));
                            }}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addPriceDetail} className="btn btn-outline">
                  <FiPlus className="icon-sm" /> Add Price Option
                </button>
              </div>
            </div>

            {/* Itinerary Tab */}
            <div
              className={`tab-content ${
                activeTab === "itinerary" ? "active" : ""
              }`}
            >
              <div className="form-group">
                <label htmlFor="itinerary-description" className="form-label">
                  Itinerary Description
                </label>
                <input
                  id="itinerary-description"
                  className="form-input"
                  value={TravelPlan.Itinerary_Details.Description}
                  onChange={(e) =>
                    setTravelPlan((prev) => ({
                      ...prev,
                      Itinerary_Details: {
                        ...prev.Itinerary_Details,
                        Description: e.target.value,
                      },
                    }))
                  }
                  placeholder="Brief description of the itinerary"
                />
              </div>

              <div className="form-stack">
                {TravelPlan.Itinerary_Details.Days.map((day, index) => (
                  <div key={index} className="card__">
                    <div className="card-header__">
                      <h3 className="card-title__">Day {day.Day}</h3>
                    </div>
                    <div className="card-content__">
                      <div className="form-grid-2">
                        <div className="form-group">
                          <label
                            htmlFor={`day-date-${index}`}
                            className="form-label-sm"
                          >
                            Date
                          </label>
                          <input
                            id={`day-date-${index}`}
                            type="date"
                            className="form-input"
                            value={day.Date}
                            onChange={(e) => {
                              const updated = [
                                ...TravelPlan.Itinerary_Details.Days,
                              ];
                              updated[index].Date = e.target.value;
                              setTravelPlan((prev) => ({
                                ...prev,
                                Itinerary_Details: {
                                  ...prev.Itinerary_Details,
                                  Days: updated,
                                },
                              }));
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label
                            htmlFor={`exp-desc-${index}`}
                            className="form-label-sm"
                          >
                            Experience Description
                          </label>
                          <input
                            id={`exp-desc-${index}`}
                            className="form-input"
                            value={day.Exp_Description}
                            onChange={(e) => {
                              const updated = [
                                ...TravelPlan.Itinerary_Details.Days,
                              ];
                              updated[index].Exp_Description = e.target.value;
                              setTravelPlan((prev) => ({
                                ...prev,
                                Itinerary_Details: {
                                  ...prev.Itinerary_Details,
                                  Days: updated,
                                },
                              }));
                            }}
                            placeholder="Description of the day's experience"
                          />
                        </div>
                        <div className="form-group">
                          <label
                            htmlFor={`sightseeing-${index}`}
                            className="form-label-sm"
                          >
                            Sightseeing Included
                          </label>
                          <input
                            id={`sightseeing-${index}`}
                            className="form-input"
                            value={day.SightSeeing_Included}
                            onChange={(e) => {
                              const updated = [
                                ...TravelPlan.Itinerary_Details.Days,
                              ];
                              updated[index].SightSeeing_Included =
                                e.target.value;
                              setTravelPlan((prev) => ({
                                ...prev,
                                Itinerary_Details: {
                                  ...prev.Itinerary_Details,
                                  Days: updated,
                                },
                              }));
                            }}
                            placeholder="Sightseeing activities"
                          />
                        </div>
                        <div className="form-group">
                          <label
                            htmlFor={`transfers-${index}`}
                            className="form-label-sm"
                          >
                            Transfers
                          </label>
                          <input
                            id={`transfers-${index}`}
                            className="form-input"
                            value={day.Transfers}
                            onChange={(e) => {
                              const updated = [
                                ...TravelPlan.Itinerary_Details.Days,
                              ];
                              updated[index].Transfers = e.target.value;
                              setTravelPlan((prev) => ({
                                ...prev,
                                Itinerary_Details: {
                                  ...prev.Itinerary_Details,
                                  Days: updated,
                                },
                              }));
                            }}
                            placeholder="Transportation details"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addDay} className="btn btn-outline">
                  <FiPlus className="icon-sm" /> Add Day
                </button>
              </div>
            </div>

            {/* Terms & Policies Tab */}
            <div
              className={`tab-content ${activeTab === "terms" ? "active" : ""}`}
            >
              <div className="terms-grid">
                <div className="card__">
                  <div className="card-header__">
                    <h3 className="card-title__">Booking Terms</h3>
                  </div>
                  <div className="card-content__">
                    <div className="scrollable-container">
                      {TravelPlan.Booking_Terms.map((term, index) => (
                        <div key={index} className="form-group">
                          <input
                            className="form-input"
                            value={term}
                            onChange={(e) => {
                              const updated = [...TravelPlan.Booking_Terms];
                              updated[index] = e.target.value;
                              setTravelPlan((prev) => ({
                                ...prev,
                                Booking_Terms: updated,
                              }));
                            }}
                            placeholder={`Term ${index + 1}`}
                          />
                        </div>
                      ))}
                      <button
                        onClick={addBookingTerm}
                        className="btn btn-outline btn-sm"
                      >
                        <FiPlus className="icon-sm" /> Add Term
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card__">
                  <div className="card-header__">
                    <h3 className="card-title__">Cancellation Policy</h3>
                  </div>
                  <div className="card-content__">
                    <div className="scrollable-container">
                      {TravelPlan.Cancellation_Policy.map((policy, index) => (
                        <div key={index} className="form-group">
                          <input
                            className="form-input"
                            value={policy}
                            onChange={(e) => {
                              const updated = [
                                ...TravelPlan.Cancellation_Policy,
                              ];
                              updated[index] = e.target.value;
                              setTravelPlan((prev) => ({
                                ...prev,
                                Cancellation_Policy: updated,
                              }));
                            }}
                            placeholder={`Policy ${index + 1}`}
                          />
                        </div>
                      ))}
                      <button
                        onClick={addCancellationPolicy}
                        className="btn btn-outline btn-sm"
                      >
                        <FiPlus className="icon-sm" /> Add Policy
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card__ full-width">
                  <div className="card-header__">
                    <h3 className="card-title__">Terms & Conditions</h3>
                  </div>
                  <div className="card-content">
                    <div className="scrollable-container">
                      {TravelPlan.Terms_And_Conditions.map((term, index) => (
                        <div key={index} className="form-group">
                          <input
                            className="form-input"
                            value={term}
                            onChange={(e) => {
                              const updated = [
                                ...TravelPlan.Terms_And_Conditions,
                              ];
                              updated[index] = e.target.value;
                              setTravelPlan((prev) => ({
                                ...prev,
                                Terms_And_Conditions: updated,
                              }));
                            }}
                            placeholder={`Condition ${index + 1}`}
                          />
                        </div>
                      ))}
                      <button
                        onClick={addTermsAndConditions}
                        className="btn btn-outline btn-sm"
                      >
                        <FiPlus className="icon-sm" /> Add Condition
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-footer">
            <button className="btn btn-primary" onClick={handleSaveItinerary}>
              <FiSave className="icon-sm" /> Save Itinerary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItineraryForm;

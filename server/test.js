const express = require("express");
const path = require("path");
const axios = require("axios");
const app = express();

// IMPORTANT: Replace with your actual Aviationstack API key
const ACCESS_KEY = "12d73265c9c04994f3fe856f2d8876ab";
const API_BASE_URL = "http://api.aviationstack.com/v1";

// In-memory cache to store API data and avoid re-fetching
const cache = {
    countries: [],
    airports: [],
};

// Function to populate the cache on server startup
async function populateCache() {
    try {
        console.log("✈️  Populating server cache from Aviationstack API...");
        const [countryResponse, airportResponse] = await Promise.all([
            axios.get(`${API_BASE_URL}/countries`, { params: { access_key: ACCESS_KEY } }),
            axios.get(`${API_BASE_URL}/airports`, { params: { access_key: ACCESS_KEY, limit: 2000 } }) // Fetch a larger list of airports
        ]);
        
        cache.countries = countryResponse.data.data.map(c => ({ name: c.country_name, value: c.country_iso2 }));
        cache.airports = airportResponse.data.data;
        
        console.log(`✅ Cache populated: ${cache.countries.length} countries, ${cache.airports.length} airports.`);
    } catch (error) {
        console.error("❌ Failed to populate cache. The API may be unavailable or the key invalid.", error.message);
    }
}

// Serve static files (like index.html) from the 'public' directory
app.use(express.static('public'));

// --- API Endpoints for Dropdowns ---
app.get("/api/countries", (req, res) => {
    res.json(cache.countries.sort((a, b) => a.name.localeCompare(b.name)));
});

app.get("/api/states", (req, res) => {
    const { country } = req.query;
    if (!country) return res.status(400).json({ error: "Country code is required." });
    
    const states = new Set();
    cache.airports
        .filter(airport => airport.country_iso2 === country && airport.timezone) // Use timezone as a proxy for state/region
        .forEach(airport => {
            const region = airport.timezone.split('/')[0];
            states.add(region);
        });
    
    const stateList = Array.from(states).map(s => ({ name: s.replace(/_/g, ' '), value: s })).sort((a, b) => a.name.localeCompare(b.name));
    res.json(stateList);
});

app.get("/api/airports", (req, res) => {
    const { country, state } = req.query;
    if (!country || !state) return res.status(400).json({ error: "Country and state are required." });

    const airports = cache.airports
        .filter(airport => airport.country_iso2 === country && airport.timezone && airport.timezone.startsWith(state))
        .map(airport => ({ name: `${airport.airport_name} (${airport.iata_code})`, value: airport.iata_code }))
        .sort((a, b) => a.name.localeCompare(b.name));
    res.json(airports);
});

// --- Main Search Route ---
app.get("/search", async (req, res) => {
    try {
        const { departure_airport, destination_airport, date } = req.query;
        if (!departure_airport || !destination_airport || !date) {
            return res.status(400).send("Missing search parameters.");
        }

        const params = {
            access_key: ACCESS_KEY,
            dep_iata: departure_airport,
            arr_iata: destination_airport,
            flight_date: date,
        };

        const apiResponse = await axios.get(`${API_BASE_URL}/flights`, { params });
        const flightData = apiResponse.data;

        // Render the results as an HTML page
        let html = `
            <html>
            <head>
                <title>Flight Search Results</title>
                <style>body{font-family:Arial,sans-serif;padding:20px;background:#f9f9f9}h1{color:#333}a{color:#007bff;text-decoration:none}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ccc;padding:10px;text-align:left}th{background:#333;color:#fff}</style>
            </head>
            <body>
                <h1>✈️ Flight Results</h1>
                <p>Showing flights from <strong>${departure_airport}</strong> to <strong>${destination_airport}</strong> on <strong>${date}</strong></p>
                <a href="/">&larr; Back to Search</a>`;

        if (Array.isArray(flightData.data) && flightData.data.length > 0) {
            html += `
                <table>
                    <tr><th>Flight</th><th>Airline</th><th>Departure</th><th>Arrival</th><th>Status</th></tr>`;
            flightData.data.forEach(flight => {
                html += `
                    <tr>
                        <td>${flight.flight.iata}</td>
                        <td>${flight.airline.name}</td>
                        <td>${flight.departure.airport} at ${new Date(flight.departure.scheduled).toLocaleTimeString()}</td>
                        <td>${flight.arrival.airport} at ${new Date(flight.arrival.scheduled).toLocaleTimeString()}</td>
                        <td>${flight.flight_status}</td>
                    </tr>`;
            });
            html += `</table>`;
        } else {
            html += `<p>No flights found for this route on the selected date.</p>`;
        }
        
        html += `</body></html>`;
        res.send(html);

    } catch (error) {
        console.error("❌ Error fetching flight data:", error.response ? error.response.data : error.message);
        res.status(500).send(`
            <html><body>
                <h1>❌ Error Fetching Flight Data</h1>
                <p>${error.response?.data?.error?.message || "An unexpected error occurred."}</p>
                <a href="/">&larr; Back to Search</a>
            </body></html>`);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    populateCache();
});
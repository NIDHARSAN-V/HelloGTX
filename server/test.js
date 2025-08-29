// server.js

const express = require("express");
const axios = require("axios");
const app = express();

// --- Parameters for the /flightsFuture endpoint ---
const futureParams = {
    access_key: "12d73265c9c04994f3fe856f2d8876ab", // Replace with your actual access key
    iataCode: "MAA",      // Airport code
    type: "departure",    // 'departure' or 'arrival'
    date: "2025-10-15"    // Future date
    //filter by country/state then fetch the data,  

};



app.get("/", async (req, res) => {
    try {
        console.log(`✈️ Fetching future flight schedules for ${futureParams.iataCode} on ${futureParams.date}...`);

        // Call AviationStack API
        const response = await axios.get("http://api.aviationstack.com/v1/flightsFuture", {
            params: futureParams
        });

        const apiResponse = response.data;

        let html = `
        <html>
        <head>
            <title>Future Flight Schedules</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; }
                h1 { color: #333; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
                th { background: #333; color: #fff; }
                tr:nth-child(even) { background: #f2f2f2; }
            </style>
        </head>
        <body>
            <h1>✈️ Future Departures from ${futureParams.iataCode} on ${futureParams.date}</h1>
        `;

        if (Array.isArray(apiResponse.data) && apiResponse.data.length > 0) {
            html += `
                <table>
                    <tr>
                        <th>Flight</th>
                        <th>Airline</th>
                        <th>Destination</th>
                        <th>Scheduled Departure</th>
                    </tr>
            `;

            apiResponse.data.forEach(flight => {
                const airlineName = flight.codeshared ? flight.codeshared.airline.name : flight.airline.name;
                html += `
                    <tr>
                        <td>${flight.flight.iataNumber}</td>
                        <td>${airlineName}</td>
                        <td>${flight.arrival.iataCode}</td>
                        <td>${flight.departure.scheduledTime}</td>
                    </tr>
                `;
            });

            html += `</table>`;
        } else {
            html += `<p>No future flight schedules were found for the specified airport and date.</p>`;
        }

        html += `</body></html>`;

        res.send(html);

    } catch (error) {
        console.error("❌ Error fetching flight data:", error.message);

        res.send(`
            <html>
            <body>
                <h1>❌ Error fetching flight data</h1>
                <p>${error.response?.data?.error?.message || error.message}</p>
            </body>
            </html>
        `);
    }
});





const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});




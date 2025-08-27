const axios = require("axios");

const headers = {
    'x-rapidapi-key': 'ababbbfcb0msh91ba78839e7e291p124b79jsn76d7289b9344',
    'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
};

async function getCityIdByName(query) {
    try {
        const response = await axios.get(
            "https://sky-scrapper.p.rapidapi.com/api/v1/hotels/searchDestinationOrHotel",
            {
                params: {
                    query, 
                },
                headers
            }
        );

        const location = response.data.data[0];
        console.log("📍 Location result:", location);

        return location.entityId; 
    } catch (err) {
        console.error("❌ Error getting cityId:", err.response?.data || err.message);
    }
}

// Step 2: Get hotels from cityId
async function getHotelsByCityId(cityId) {
    try {
        const response = await axios.get(
            "https://sky-scrapper.p.rapidapi.com/api/v1/hotels/searchHotels",
            {
                params: {
                    entityId: cityId,
                    checkIin: "2025-10-01",
                    checkout: "2025-10-05",
                },
                headers
            }
        );

        const hotels = response.data;
        console.log("🏨 Hotels result:", hotels)
        return hotels;
    } catch (err) {
        console.error("❌ Error getting hotels:", err.response?.data || err.message);
    }
}

// Step 3: Run for an Indian city
(async () => {
    const cityId = await getCityIdByName("chennai"); // 🇮🇳 Try Erode, Chennai, Mumbai, Delhi...
    if (cityId) {
        await getHotelsByCityId(cityId);
    }
})();

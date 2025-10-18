

const sendQueryItinerary = (req, res) => {
    try {
        console.log(req.body)
      
    } catch (error) {
        return res.status(500).json({ message: "Service Error" });
    }
}

module.exports = {
    sendQueryItinerary
};
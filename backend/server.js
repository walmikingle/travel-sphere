
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const {MongoClient} = require("mongodb");
const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
let db;

app.get("/destinations" , function(req,res) {
    // res.send("Backend is Running");
    const destinations = [
    {
        name: "Shanivar Wada",
        location: "Central Pune",
        entry_fees: "25 Rupees",
        rating: "4.5",
        image: "https://www.adotrip.com/public/images/areas/master_images/5c6a5fb858f94-Shaniwar_Wada_Attractions.jpg"
    },
    {
        name: "Sinhagad Fort",
        location: "30km SW",
        entry_fees: "Free",
        rating: "4.8",
        image: "https://punetourism.co.in/images/places-to-visit/headers/sinhagad-fort-pune-tourism-entry-fee-timings-holidays-reviews-header.jpg"
    }
]; 

res.json(destinations);
});


app.get("/itinerary", async function(req, res) {
     console.log("POST HIT:", req.body);
    const data = await db.collection("itinerary").find().toArray();
    res.json(data);
});

app.post("/itinerary", async function(req, res) {
    try {
        console.log("BODY RECEIVED:", req.body); // 👈 ADD THIS

        const place = req.body;

        const exists = await db.collection("itinerary").findOne({ name: place.name });

        if (!exists) {
            await db.collection("itinerary").insertOne(place);
        }

        const updated = await db.collection("itinerary").find().toArray();
        res.json(updated);

    } catch (error) {
        console.log("ERROR:", error); // 👈 THIS WILL SHOW REAL ISSUE
        res.status(500).send("Server Error");
    }
});

async function startServer() {
    await client.connect();
    console.log("MongoDB connected");

    db = client.db("travel_sphere");

    app.listen(3000, function() {
        console.log("Server running on http://localhost:3000");
    });
}

startServer();

app.delete("/itinerary", async function(req, res) {
    const name = req.body.name;


    if (name === "ALL") {
        await db.collection("itinerary").deleteMany({});
    } else {
        await db.collection("itinerary").deleteOne({name : name});
    }
    const updated = await db.collection("itinerary").find().toArray();
    res.json(updated);
        });

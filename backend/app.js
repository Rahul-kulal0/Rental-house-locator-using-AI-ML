const express = require("express");
const cors = require("cors");

const houseRoutes = require("./api/routes/houseRoutes");
const authRoutes = require("./api/routes/authRoutes");
const priceRoutes = require("./api/routes/priceRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Rental House Locator Backend Working!");
});

app.use("/api/houses", houseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/price", priceRoutes);

module.exports = app;

const express = require("express");
const router = express.Router();
const { predictPrice } = require("../controllers/priceController");

router.post("/predict", predictPrice);

module.exports = router;
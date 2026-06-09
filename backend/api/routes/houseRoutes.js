const express = require("express");
const router = express.Router();

const { 
  getAllHouses, 
  filterHouses, 
  getHouseById,
  paginateHouses,
  searchLocations,
  getSimilarHouses,
  findHousesFromDataset,
  getDatasetStats,
  getHouseFromDataset,
  getSimilarHousesFromDataset
} = require("../controllers/houseController");

router.get("/", getAllHouses);
router.get("/filter", filterHouses);
router.get("/paginate", paginateHouses);
router.get("/search", searchLocations);
router.get("/dataset", findHousesFromDataset);
router.get("/dataset/stats", getDatasetStats);
router.get("/dataset/:id", getHouseFromDataset);
router.get("/dataset/similar/:id", getSimilarHousesFromDataset);
router.get("/similar/:id", getSimilarHouses);
router.get("/:id", getHouseById);

module.exports = router;

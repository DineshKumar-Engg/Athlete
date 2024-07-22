const express = require("express");
const router = express.Router();
// const auth = require("../../utills/auth");
const { getAllStates, getAllCities, allCities } = require("../../controllers/usa/usaController");

router.get("/getallcities", getAllCities);
router.get("/getallstates", getAllStates);
router.get("/allcities", allCities);

module.exports = router;

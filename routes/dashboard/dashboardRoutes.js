const express = require("express");
const router = express.Router();
const auth = require("../../utills/auth");
const { totalProfileReport, overAllReport, athleteReport, academieReport, coachReport, athleteRevenue, academieRevenue, athleteRevenueMonth, academieRevenueMonth } = require("../../controllers/dashboard/dashboardController");

router.get("/totalusers", auth.authorization, totalProfileReport);
router.get("/overallprofiles", auth.authorization, overAllReport);
router.get("/athleteprofiles", auth.authorization, athleteReport);
router.get("/academieprofiles", auth.authorization, academieReport);
router.get("/coachprofiles", auth.authorization, coachReport);
router.get("/athleterevenue", auth.authorization, athleteRevenue);
router.get("/academierevenue", auth.authorization, academieRevenue);
router.get("/athleterevenuewithmonths", auth.authorization, athleteRevenueMonth);
router.get("/academierevenuemonths", auth.authorization, academieRevenueMonth);
module.exports = router;
const express = require("express");
const router = express.Router();
const auth = require("../../utills/auth");
const { promocodeReport, athleteReport, academieReport, athletePurchaseReport, academiePurcahseReport, promocodePurchaseReport } = require("../../controllers/reports/reportsController");

router.get("/promocodereport", auth.authorization, promocodeReport);
router.get("/athletereport", auth.authorization, athleteReport);
router.get("/academiereport", auth.authorization, academieReport);
router.get("/athletepurchasereport", auth.authorization, athletePurchaseReport);
router.get("/academiepurchasereport", auth.authorization, academiePurcahseReport);
router.get("/promocodepurchasereport", auth.authorization, promocodePurchaseReport);
module.exports = router;

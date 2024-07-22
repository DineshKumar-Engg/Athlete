const express = require("express");
const router = express.Router();
const auth = require("../../utills/auth");
const { addSpeciality, editSpeciality, deleteSpeciality, getAllSpeciality, getSpeciality, getSportsBasedSpeciality } = require("../../controllers/speciality/specialityController");

router.post("/addspeciality", auth.authorization, addSpeciality);
router.post("/editspeciality", auth.authorization, editSpeciality);
router.delete("/deletespeciality/:id", auth.authorization, deleteSpeciality);
router.get("/getallspeciality", auth.authorization, getAllSpeciality);
router.get("/getspeciality/:specialityId", auth.authorization, getSpeciality);
router.get("/getspecialitybysport", getSportsBasedSpeciality);
module.exports = router;

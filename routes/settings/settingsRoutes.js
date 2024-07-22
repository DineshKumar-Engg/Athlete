const express = require("express");
const router = express.Router();
const auth = require("../../utills/auth");

const { addSettings, editSettings, getSingleSettings } = require("../../controllers/settings/settingsController");

router.post("/addsettings", auth.authorization, addSettings);
router.post("/editsettings", auth.authorization, editSettings);
router.get("/getsettings/:id", getSingleSettings);
module.exports = router;

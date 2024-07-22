const express = require("express");
const router = express.Router();
const { forgotPassword } = require("../../controllers/password/forgotPasswordController");

router.post("/forgotpassword", forgotPassword);
module.exports = router;

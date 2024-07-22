const express = require("express");
const router = express.Router();
const { addRole } = require("../../controllers/role/roleController");

router.post("/addrole", addRole);
module.exports = router;

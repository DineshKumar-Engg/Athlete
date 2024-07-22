const express = require("express");
const router = express.Router();
const auth = require("../../utills/auth");
const { favoritesAdd, favoritesRemove, favoritesGetAll } = require("../../controllers/favorites/favoritesController");
router.post("/favoritesadd", auth.authorization, favoritesAdd);
router.post("/favoritesremove", auth.authorization, favoritesRemove);
router.get("/favoritesgetall", auth.authorization, favoritesGetAll);
module.exports = router;

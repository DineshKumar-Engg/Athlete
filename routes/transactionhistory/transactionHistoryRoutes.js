const express = require("express");
const router = express.Router();
const auth = require("../../utills/auth");

// const { createCheckout } = require("../../middlewares/squarePayment");
const { createCardPayment, getTransactionHistory, getTransactionHistorySingle, getCurrentTransactionHistory } = require("../../controllers/transactionhistory/transactionHistoryController");
// router.post("/paysubscription", auth.authorization, createCheckout, createCardPayment);
router.post("/paysubscription", auth.authorization, createCardPayment);
router.get("/transactionhistory/:userid", auth.authorization, getTransactionHistory);
router.get("/currenttransactionhistory/:userid", auth.authorization, getCurrentTransactionHistory);
router.get("/transactionhistorysingle/:id", auth.authorization, getTransactionHistorySingle);
module.exports = router;

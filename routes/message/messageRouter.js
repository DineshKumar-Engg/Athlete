const express = require("express");
const router = express.Router();
const { createMessage, deleteMessage, getMessages, getConnectedReceivers, getConnectedUsers } = require("../../controllers/message/messageController");

router.post("/", createMessage);
router.delete("/:messageId", deleteMessage);
router.get("/connecteduser/:userId", getConnectedUsers);
router.get("/connected/:senderId", getConnectedReceivers);
router.get("/:senderId/:receiverId", getMessages);
module.exports = router;

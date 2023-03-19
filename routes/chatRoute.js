const express = require("express");

const {
  createChat,
  findAllChats,
  findAsingleChat,
} = require("../controllers/chatController");

// router
const router = express.Router();

// routes
router.post("/", createChat);
router.get("/:userId", findAllChats);
router.get("/find/:firstId/:secondId", findAsingleChat);

module.exports = router;

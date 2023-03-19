const chatModle = require("../models/chatModel");

// create chat
const createChat = async (req, res) => {
  const { firstId, secandId } = req.body;

  try {
    const chat = await chatModle.findOne({
      members: { $all: [firstId, secandId] },
    });

    if (chat) {
      return res.status(200).json(chat);
    }

    const newChat = await chatModle.create({
      members: [firstId, secandId],
    });

    return res.status(200).json(newChat);
  } catch (err) {
    res.status(500).json(err);
  }
};

// find all chat
const findAllChats = async (req, res) => {
  const { userId } = req.params;

  try {
    const chats = await chatModle.find({
      members: { $in: [userId] },
    });

    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json(err);
  }
};
// find a single chat
const findAsingleChat = async (req, res) => {
  const { firstId, secondId } = req.params;

  try {
    const chat = await chatModle.find({
      members: { $in: [firstId, secondId] },
    });

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  createChat,
  findAllChats,
  findAsingleChat,
};

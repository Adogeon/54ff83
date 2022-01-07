const { Op } = require("sequelize");
const db = require("../db");
const Message = require("./message");

const Conversation = db.define("conversation", {});

// find conversation given an array of memberIds
Conversation.findConversation = async function (memberIds) {
  const conversation = await Conversation.findOne({
    where: {
      "$members.id": memberIds,
    },
    include: [{ model: User, as: "members", attributes: ["id"] }],
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

module.exports = Conversation;

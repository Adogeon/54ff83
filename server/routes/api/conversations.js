const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;

    const conversations = await Conversation.findAll({
      where: {
        "$member.id": userId,
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "DESC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
        {
          model: User,
          as: "member",
          attributes: ["id", "username", "photoUrl"],
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUsers" so that frontend will have easier access
      convoJSON.otherUsers = convoJSON.members.filter(
        (member) => member.id !== userId
      );

      // set property for online status of the other users
      convoJSON.otherUsers.forEach((user) => {
        if (onlineUsers.include(user.id)) {
          user.online = true;
        } else {
          user.online = false;
        }
      });

      //reverse the consJSON messages array to ensure the message is display in correct order
      convoJSON.messages.reverse();
      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages.at(-1).text;
      //set Message is read according to each userId,
      convoJSON.messages.forEach((message) => {
        message.isRead = message.readReceipt.includes(userId);
        delete message.readReceipt;
      });
      conversations[i] = convoJSON;
    }
    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

// mark a conversation as active so we can set
router.post("/active", (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;

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
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "DESC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      //reverse the consJSON messages array to ensure the message is display in correct order
      convoJSON.messages.reverse();
      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages.at(-1).text;
      convoJSON.newMessageCount = convoJSON.messages.filter(
        (message) => !message.isRead
      ).length;

      conversations[i] = convoJSON;
    }
    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

// mark a conversation as active so we can set
router.put("/active/:convoId", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const convoId = req.params.convoId;

    const userId = req.user.id;
    const convo = await Conversation.findByPk(convoId, {
      include: [
        {
          model: Message,
          attributes: ["id", "isRead"],
        },
      ],
    });
    const convoJSON = convo.toJSON();
    //check if user is part of the conversation
    if (userId !== convoJSON.user1Id && userId !== convoJSON.user2Id) {
      return res
        .status(401)
        .json({ error: "User is not part of the conversation" });
    }

    const newMessageIds = convoJSON.messages
      .filter((message) => !message.isRead)
      .map((message) => message.id);

    const result = await Message.update(
      { isRead: true },
      { where: { id: newMessageIds } }
    );
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

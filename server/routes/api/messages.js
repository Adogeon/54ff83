const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
      isRead: false,
    });

    const messageJSON = message.toJSON();

    res.json({ message: messageJSON, sender });
  } catch (error) {
    next(error);
  }
});

router.put("/read/:messageId", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const readerId = req.user.id;
    const messageId = req.params.messageId;

    const message = await Message.findByPk(messageId);
    if (!message.readReceipt.includes(readerId)) {
      message.readReceipt = [...message.readReceipt, readerId];
      message.save();
    }

    res.json({
      convoId: message.conversationId,
      messageId: message.id,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;

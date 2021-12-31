const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientIds, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientIds, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    const memberIds = [...recipientIds, senderId];
    let conversation = await Conversation.findConversation(memberIds);

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({});
      // set member association;
      await conversation.setMembers(memberIds);
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });

    //set message.isRead to false;
    const messageJSON = message.toJSON();
    messageJSON.isRead = false;
    delete messageJSON.readReceipt;

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

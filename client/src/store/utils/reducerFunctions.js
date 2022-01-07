export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;
    newConvo.newMessageCount = 1;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages = [...convo.messages, message];
      convoCopy.latestMessageText = message.text;
      if (convoCopy.otherUser.id === message.senderId) {
        convoCopy.newMessageCount++;
      }
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = { ...convoCopy.otherUser, online: true };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = { ...convoCopy.otherUser, online: false };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const convoCopy = { ...convo };
      convoCopy.id = message.conversationId;
      convoCopy.messages = [...convo.messages, message];
      convoCopy.latestMessageText = message.text;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const updateMessageReadInStore = (state, userId, convoId) => {
  return state.map((convo) => {
    if (convo.id === convoId) {
      const convoCopy = { ...convo };
      const updateMessages = convo.messages.map((message) => {
        if (!message.isRead && message.senderId !== userId) {
          message.isRead = true;
          return message;
        } else {
          return message;
        }
      });
      convoCopy.newMessageCount = 0;
      convoCopy.messages = updateMessages;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const updateLastMessageReadInStore = (
  state,
  convoId,
  messageId,
  senderId
) => {
  if (messageId === null) return state;
  return state.map((convo) => {
    if (convo.id === convoId) {
      const convoCopy = { ...convo };
      if (senderId === convo.otherUser.id);
      convoCopy.lastMessageReadId = messageId;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

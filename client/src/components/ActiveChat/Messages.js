import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import { connect } from "react-redux";
import { sendReadReceipt } from "../../store/utils/thunkCreators";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId, readMessage } = props;

  return (
    <Box>
      {messages.map((message, index) => {
        const time = moment(message.createdAt).format("h:mm");

        if (!message.isRead) {
          readMessage(message.id, index);
        }

        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    readMessage: (messageId, messageIndex) => {
      dispatch(sendReadReceipt(messageId, messageIndex));
    },
  };
};

export default connect(null, mapDispatchToProps)(Messages);

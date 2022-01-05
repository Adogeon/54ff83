import React from "react";
import { Box, Typography, Badge } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  badge: {
    "& .MuiBadge-anchorOriginTopRightRectangle": {
      transform: "scale(1) translate(-50%,50%)",
      transformOrigin: "center",
    },
    "& .MuiBadge-anchorOriginTopRightRectangle.MuiBadge-invisible": {
      transform: "scale(0) translate(-50%,50%)",
    },
  },
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation } = props;
  const { latestMessageText, otherUser, newMessageCount } = conversation;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
      <Badge
        className={classes.badge}
        badgeContent={newMessageCount}
        color="primary"
      ></Badge>
    </Box>
  );
};

export default ChatContent;

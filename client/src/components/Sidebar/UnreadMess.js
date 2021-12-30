import React from "react";
import { Box, Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
  },
  amount: {
    borderRadius: "10px",
    backgroundColor: "#3F92FF",
    fontSize: "10px",
    padding: "3px 7px",
    color: "#FFFFFF",
  },
}));

const NewMessAlert = (props) => {
  const styles = useStyles();

  return (
    <Box className={styles.root}>
      <Typography className={styles.amount}>{props.newMessageCount}</Typography>
    </Box>
  );
};

export default NewMessAlert;

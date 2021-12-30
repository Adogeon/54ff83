const Sequelize = require("sequelize");
const db = require("../db");

const Message = db.define(
  "message",
  {
    text: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    senderId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    //store an array of userId that have readReceipt
    readReceipt: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
    },
  },
  {
    hooks: {
      beforeCreate: (record, options) => {
        //always have the readReceipt from the sender
        record.dataValues.readReceipt = [record.dataValues.senderId];
      },
    },
  }
);

module.exports = Message;

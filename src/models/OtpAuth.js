const { DataTypes } = require("sequelize");
const DB = require("../config/sequelize.config");
const User = require("./User");

const OtpAuth = DB.define("otp", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  otp: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  expire: {
    type: DataTypes.DATE,
    defaultValue: new Date(),
    allowNull: false,
  },
});

OtpAuth.belongsTo(User, { foreignKey: "userId" });

/* OtpAuth.sync({ alter: true })
  .then((result) => {
    console.log("The table for the OtpAuth model was just (re)created!");
  })
  .then((err) => {
    console.log(err);
  }); */

module.exports = OtpAuth;

const { DataTypes } = require("sequelize");
const DB = require("../config/sequelize.config");
const User = require("./User");
// const { tokenTypes } = require("../config/tokens");

const AuthToken = DB.define("auth_token", {
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
  token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM,
    values: ["access", "refresh", "resetPassword", "verifyEmail"],
    allowNull: false,
  },
  expire: {
    type: DataTypes.DATE,
    defaultValue: new Date(),
    allowNull: false,
  },
});

AuthToken.belongsTo(User, { foreignKey: "userId" });

/* AuthToken.sync({ alter: true })
  .then((result) => {
    console.log("The table for the AuthToken model was just (re)created!");
  })
  .then((err) => {
    console.log(err);
  }); */

module.exports = AuthToken;

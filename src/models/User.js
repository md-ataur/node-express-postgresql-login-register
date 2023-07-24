const { DataTypes } = require("sequelize");
const DB = require("../config/sequelize.config");

const User = DB.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userName: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

/* User.sync({ alter: true })
  .then((result) => {
    console.log("The table for the User model was just (re)created!");
  })
  .then((err) => {
    console.log(err);
  }); */

module.exports = User;

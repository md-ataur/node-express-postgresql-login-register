const { DataTypes } = require("sequelize");
const DB = require("../config/sequelize.config");

const Vehicle = DB.define("vehicle", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  licenseNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vehicleType: {
    type: DataTypes.ENUM,
    values: ["car", "microbus", "truck"],
  },
  charge: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  entryDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  exitDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  entryTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  exitTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
  },
});

/* Vehicle.sync({ alter: true })
  .then((result) => {
    console.log("The table for the Vehicle model was just (re)created!");
  })
  .then((err) => {
    console.log(err);
  }); */

module.exports = Vehicle;

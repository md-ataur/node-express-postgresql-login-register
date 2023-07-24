const httpStatus = require("http-status");
const { vehicleService } = require("../services");
const { success, error } = require("../utils/ApiResponse");

// Get all data
const getVehicles = async (req, res) => {
  try {
    const data = await vehicleService.getVehicles();
    res.status(httpStatus.OK).send(success(data, "Vehicles found successfully"));
  } catch (err) {
    res.send(error(err.message));
  }
};

// Add data
const addVehicle = async (req, res) => {
  try {
    const data = await vehicleService.addVehicle(req.body);
    res.status(httpStatus.CREATED).send(success(data, "Vehicle successfully added"));
  } catch (err) {
    res.send(error(err.message));
  }
};

// Get data by id
const getVehicleById = async (req, res) => {
  try {
    const data = await vehicleService.getVehicleById(req.params.id);
    res.status(httpStatus.OK).send(success(data, "Vehicle found successfully"));
  } catch (err) {
    res.send(error(err.message));
  }
};

// Update data
const updateVehicle = async (req, res) => {
  try {
    const data = await vehicleService.updateVehicle(req.params.id, req.body);
    res.status(httpStatus.OK).send(success(data, "Vehicle updated successfully"));
  } catch (err) {
    res.send(error(err.message));
  }
};

// Delete data
const deleteVehicle = async (req, res) => {
  try {
    const data = await vehicleService.deleteVehicle(req.params.id);
    res.status(httpStatus.OK).send(success(data, "Vehicle deleted successfully"));
  } catch (err) {
    res.send(error(err.message));
  }
};

module.exports = {
  getVehicles,
  addVehicle,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};

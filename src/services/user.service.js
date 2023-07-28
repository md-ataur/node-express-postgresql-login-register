/* eslint-disable no-param-reassign */
const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  try {
    const username = await User.findAll({
      attributes: ["id"],
      where: {
        userName: userBody.username,
      },
    });

    if (username.length !== 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Username already taken");
    }

    const phone = await User.findAll({
      attributes: ["id"],
      where: {
        phone: userBody.phone,
      },
    });

    if (phone.length !== 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Phone already taken");
    }

    const userEmail = await User.findAll({
      attributes: ["id"],
      where: {
        email: userBody.email,
      },
    });

    if (userEmail.length === 0) {
      const salt = bcrypt.genSaltSync(10);
      userBody.password = bcrypt.hashSync(userBody.password, salt);
      const user = await User.create({
        email: userBody.email,
        password: userBody.password,
        fullName: userBody.name,
        userName: userBody.username,
        phone: userBody.phone,
      });
      return user;
    }
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  } catch (error) {
    throw new ApiError(error.errorCode, error.message);
  }
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findOne({ where: { id } });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ where: { email } });
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
};

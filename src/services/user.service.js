/* eslint-disable no-param-reassign */
const httpStatus = require("http-status-codes");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

/**
 * Create a user
 * @param {Object} body
 * @returns {Promise<User>}
 */
const createUser = async (body) => {
  try {
    const username = await User.findAll({
      attributes: ["id"],
      where: {
        userName: body.username,
      },
    });

    if (username.length !== 0) {
      throw new Error("Username already taken");
    }

    const phone = await User.findAll({
      attributes: ["id"],
      where: {
        phone: body.phone,
      },
    });

    if (phone.length !== 0) {
      throw new Error("Phone already taken");
    }

    const userEmail = await User.findAll({
      attributes: ["id"],
      where: {
        email: body.email,
      },
    });

    if (userEmail.length === 0) {
      const salt = bcrypt.genSaltSync(10);
      body.password = bcrypt.hashSync(body.password, salt);
      const user = await User.create({
        fullName: body.name,
        userName: body.username,
        email: body.email,
        password: body.password,
        phone: body.phone,
      });
      return user;
    }
    throw new Error("Email already taken");
  } catch (error) {
    return {
      error: true,
      message: error.message,
    };
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

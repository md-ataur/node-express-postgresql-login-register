const httpStatus = require("http-status");
const { compareSync, genSaltSync, hashSync } = require("bcryptjs");
const tokenService = require("./token.service");
const userService = require("./user.service");
const { User, AuthToken, OtpAuth } = require("../models");
const { tokenTypes } = require("../config/tokens");
const ApiError = require("../utils/ApiError");

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  try {
    const user = await userService.getUserByEmail(email);
    if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
    const pass = compareSync(password, user.dataValues.password);
    if (pass) {
      await User.update({ last_login: new Date() }, { where: { id: user.dataValues.id } });
      return user;
    }
  } catch (err) {
    throw new ApiError(httpStatus.UNAUTHORIZED, err.message);
  }
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  try {
    const refreshTokenDoc = await AuthToken.findOne({ where: { token: refreshToken } });
    if (!refreshTokenDoc) {
      throw new ApiError(httpStatus.NOT_FOUND, "Please authenticate. Token Error");
    }
    return await AuthToken.destroy({ where: { token: refreshToken } });
  } catch (err) {
    throw new ApiError(httpStatus.NOT_FOUND, "Logout Error");
  }
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.userId);
    if (!user) throw new Error("Please authenticate");
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Token Error");
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} body
 * @returns {Promise}
 */
const resetPassword = async (body) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(body.token, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc?.dataValues.userId);
    if (!user) throw new Error("User not found to reset password");

    if (body.password === body.confirmPassword) {
      const salt = genSaltSync(10);
      const pass = hashSync(body.password, salt);
      const newPass = await User.update({ password: pass }, { where: { id: user.dataValues.id } });
      await AuthToken.destroy({ where: { userId: user.dataValues.id } });
      return newPass;
    }
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.dataValues.userId);
    if (!user) throw new Error("User not found to verify email");
    await AuthToken.destroy({ where: { userId: user.dataValues.id, type: tokenTypes.VERIFY_EMAIL } });
    User.update({ isEmailVerified: true }, { where: { id: user.id } });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Email verification failed");
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};

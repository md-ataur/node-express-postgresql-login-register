const httpStatus = require("http-status");
const { compareSync } = require("bcryptjs");
const tokenService = require("./token.service");
const userService = require("./user.service");
const { AuthToken } = require("../models");
const { User } = require("../models");
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
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
    const pass = compareSync(password, user.dataValues.password);

    if (pass) {
      await User.update({ last_login: new Date() }, { where: { id: user.dataValues.id } });
      return user;
    }
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, error.message);
  }
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  try {
    const refreshTokenDoc = await AuthToken.findOne({ where: { refresh_token: refreshToken } });
    if (!refreshTokenDoc) {
      throw new ApiError(httpStatus.NOT_FOUND, "Please authenticate. Token Error");
    }
    return await AuthToken.destroy({ where: { refresh_token: refreshToken } });
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
    const user = await User.findOne({
      where: {
        id: refreshTokenDoc.userId,
      },
    });
    if (!user) {
      throw new Error("Please authenticate. Token Error");
    }
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
/* const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(
      resetPasswordToken,
      tokenTypes.RESET_PASSWORD
    );
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await AuthToken.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
  }
}; */

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
/* const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(
      verifyEmailToken,
      tokenTypes.VERIFY_EMAIL
    );
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await AuthToken.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Email verification failed");
  }
}; */

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  // resetPassword,
  // verifyEmail,
};

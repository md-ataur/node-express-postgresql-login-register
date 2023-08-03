const httpStatus = require("http-status");
const { OtpAuth } = require("../models");
const userService = require("./user.service");
const ApiError = require("../utils/ApiError");

/**
 * Save OTP to Login
 * @param {string} email
 * @param {string} OTP
 * @returns {Promise}
 */
const saveOtpToLogin = async (email, OTP) => {
  const user = await userService.getUserByEmail(email);
  if (!user) throw new Error("User not found to save OTP");
  await OtpAuth.destroy({ where: { userId: user.dataValues.id } });
  return await OtpAuth.create({
    userId: user.dataValues.id,
    otp: OTP,
    expire: new Date(new Date().getTime() + 300000),
  });
};

/**
 * Verify OTP to Login
 * @param {string} email
 * @param {string} otp
 * @returns {Promise}
 */
const verifyOtpToLogin = async (email, otp) => {
  const user = await userService.getUserByEmail(email);
  if (!user) throw new Error("User not found to verify OTP");
  const otpRes = await OtpAuth.findOne({
    where: {
      userId: user.dataValues.id,
      otp,
    },
  });
  if (otpRes === null) throw new Error("Otp does not matched");
  if (otpRes.dataValues.expire > new Date(new Date().getTime())) return user;
  throw new Error("Otp Expired");
};

module.exports = {
  saveOtpToLogin,
  verifyOtpToLogin,
};

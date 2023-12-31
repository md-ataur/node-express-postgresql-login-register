const Joi = require("joi");
const { password } = require("./custom.validation");

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    username: Joi.string().required(),
    name: Joi.string().required(),
    phone: Joi.string().allow(""),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  /* query: Joi.object().keys({
    token: Joi.string().required(),
  }), */
  body: Joi.object().keys({
    token: Joi.string().required(),
    password: Joi.string().required().custom(password),
    confirmPassword: Joi.string().required(),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const checkEmail = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const otpSize = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    otp: Joi.number().required().ruleset.min(99999).max(1000000).rule({ message: "OTP Must be 6 digits" }),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  checkEmail,
  otpSize,
};

const httpStatus = require("http-status-codes");
const catchAsync = require("../utils/catchAsync");
const { authService, userService, tokenService, emailService, otpService } = require("../services");
const { success, error } = require("../utils/ApiResponse");

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  if (user.error) res.status(httpStatus.BAD_REQUEST).send(error(user.message));
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send(success({ user, tokens }, "Successfully you are registered"));
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  if (user.error) res.status(httpStatus.BAD_REQUEST).send(error(user.message));
  const tokens = await tokenService.generateAuthTokens(user);
  res.send(success({ user, tokens }, "Login Successfully"));
});

const logout = catchAsync(async (req, res) => {
  const user = await authService.logout(req.body.refreshToken);
  if (user.error) res.status(httpStatus.BAD_REQUEST).send(error(user.message));
  res.status(httpStatus.OK).send(success({}, "Logout Successfully"));
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  if (tokens.error) res.status(httpStatus.NOT_FOUND).send(error(tokens.message));
  res.send(success({ ...tokens }));
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  if (resetPasswordToken.error) res.status(httpStatus.NOT_FOUND).send(error(resetPasswordToken.message));
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.CREATED).send(success({}, "Password recover link sent to your email"));
});

const resetPassword = catchAsync(async (req, res) => {
  const resetPass = await authService.resetPassword(req.body);
  if (resetPass.error) res.status(httpStatus.BAD_REQUEST).send(error(resetPass.message));
  res.status(httpStatus.OK).send(success({}, "Password reset successfully"));
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.OK).send(success({}, "Verification link sent to your email"));
});

const verifyEmail = catchAsync(async (req, res) => {
  const response = await authService.verifyEmail(req.query.token);
  if (response.error) res.status(httpStatus.BAD_REQUEST).send(error(response.message));
  res.status(httpStatus.OK).send(success({}, "Email verified successfully"));
});

const sendOtpToLogin = catchAsync(async (req, res) => {
  const OTP = Math.floor(100000 + Math.random() * 99999);
  const response = await otpService.saveOtpToLogin(req.body.email, OTP);
  if (response.error) res.status(httpStatus.BAD_REQUEST).send(error(response.message));
  await emailService.sendVerificationOTP(req.body.email, OTP);
  res.status(httpStatus.OK).send(success({}, "OTP sent to your email"));
});

const verifyOtpToLogin = catchAsync(async (req, res) => {
  const user = await otpService.verifyOtpToLogin(req.body.email, req.body.otp);
  if (user.error) res.status(httpStatus.BAD_REQUEST).send(error(user.message));
  res.status(httpStatus.OK).send(success({ user }, "OTP verified"));
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  sendOtpToLogin,
  verifyOtpToLogin,
};

const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { authService, userService, tokenService, emailService, otpService } = require("../services");
const { success } = require("../utils/ApiResponse");

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send(success({ user, tokens }));
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send(success({ user, tokens }));
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.OK).send(success({}, "Logout Successfully"));
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send(success({ ...tokens }));
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.CREATED).send(success({}, "Password recover link sent to the email"));
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.body);
  res.status(httpStatus.OK).send(success({}, "Password reset successfully"));
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.OK).send(success({}, "Verification link sent to the email"));
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.OK).send(success({}, "Email verified successfully"));
});

const sendOtpToLogin = catchAsync(async (req, res) => {
  const OTP = Math.floor(100000 + Math.random() * 99999);
  await otpService.saveOtpToLogin(req.body.email, OTP);
  await emailService.sendVerificationOTP(req.body.email, OTP);
  res.status(httpStatus.OK).send(success({}, "OTP sent to your email"));
});

const verifyOtpToLogin = catchAsync(async (req, res) => {
  const user = await otpService.verifyOtpToLogin(req.body.email, req.body.otp);
  res.status(httpStatus.OK).send(success({ user }));
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

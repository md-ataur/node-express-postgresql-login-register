const express = require("express");
const validate = require("../../middlewares/validate");
const { authValidation } = require("../../validations");
const { authController } = require("../../controllers");

const router = express.Router();

router.post("/register", validate(authValidation.register), authController.register);
router.post("/login", validate(authValidation.login), authController.login);
router.post("/logout", validate(authValidation.logout), authController.logout);
router.post("/refresh-tokens", validate(authValidation.refreshTokens), authController.refreshTokens);
router.post("/forgot-password", validate(authValidation.forgotPassword), authController.forgotPassword);

module.exports = router;
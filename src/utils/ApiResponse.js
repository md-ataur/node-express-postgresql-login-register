/**
 * @desc    Send any success response
 *
 * @param   {string} message
 * @param   {object | array} results
 * @param   {number} statusCode
 */
const success = (data, message) => ({
  success: true,
  message,
  data,
  error: {
    status: false,
    message: "No Error",
  },
});

/**
 * @desc    Send any error response
 *
 * @param   {string} message
 * @param   {number} statusCode
 */
const error = (message) => ({
  success: false,
  message,
  data: {},
  error: {
    status: true,
  },
});

module.exports = {
  success,
  error,
};

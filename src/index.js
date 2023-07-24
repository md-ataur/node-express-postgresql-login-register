require("dotenv").config();
require("./config/sequelize.config");
require("./models");
const logger = require("./config/logger");
const app = require("./app");

const port = process.env.PORT || 5000;

app.listen(port, () => {
  logger.info(`Listening to port ${port}`);
});

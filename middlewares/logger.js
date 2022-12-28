const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

const logger = createLogger({
  level: "debug",
  format: combine(
    timestamp({
      format: "DD-MMM-YYYY HH:mm:ss",
    }),
    prettyPrint()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "error.log" }),
  ],
});

module.exports = logger;

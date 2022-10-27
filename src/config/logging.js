const { createLogger, format, transports } = require("winston");
const { combine, printf, label, timestamp, splat, colorize } = format;

const appLogFormat = printf(({ level, message, label, timestamp }) => {
  return `[${label.toUpperCase()}] ${level}: ${message}`;
});

function getLogger(name) {
  return createLogger({
    format: combine(
      label({ label: name }),
      timestamp(),
      colorize(),
      splat(),
      appLogFormat
    ),
    transports: [new transports.Console()],
  });
}

const appLogger = getLogger("APP");

module.exports = { getLogger, appLogger };

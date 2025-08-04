const { createLogger, transports, format } = require('winston');
const path = require('path');
const fs = require('fs');

const isTest = process.env.NODE_ENV === 'test';

const loggerTransports = [
  new transports.Console()
];

if (!isTest) {
  const logDir = path.join(__dirname, '..', 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  loggerTransports.push(
    new transports.File({ filename: path.join(logDir, 'notification-service.log') })
  );
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: loggerTransports
});

module.exports = logger;

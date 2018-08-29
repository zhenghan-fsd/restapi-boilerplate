import winston from 'winston';

const format = winston.format.printf(
  info => `${info.timestamp}: [${info.level}] ${info.message}`
);

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format
  ),
  transports: [new winston.transports.Console()]
});

export default logger;

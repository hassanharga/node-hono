import { createLogger, format, transports } from 'winston';

import { config } from '@/config';

const { combine, timestamp, colorize, json, prettyPrint, errors } = format;

// const customFormat = printf(({ level, message, timestamp, service }) => {
//   return `${timestamp}${service ? ` [${service}]` : ""} [${level}]: ${message}`;
// });

const logger = createLogger({
  level: config.LOG_LEVEL,
  defaultMeta: { service: 'APP' },
  format: combine(
    errors({ stack: true }),
    timestamp(),
    json(),
    prettyPrint(),
    colorize({ all: true }),
    // customFormat,
  ),
  transports: [
    new transports.Console({ }),
    // new transports.File({ filename: "error.log", level: "error" }),
    // new transports.File({ filename: "combined.log" }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'exceptions.log' }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: 'rejections.log' }),
  ],
});

// const childLogger = logger.child({ requestId: 'f9ed4675f1c53513c61a3b3b4e25b4c0' });

export default logger;

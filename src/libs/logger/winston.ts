import winston from 'winston';

const { combine, timestamp, json, printf, colorize } = winston.format;

const consoleFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(({ timestamp: ts, level, message, ...meta }) => {
    const metaKeys = Object.keys(meta);
    const metaStr = metaKeys.length ? JSON.stringify(meta) : '';
    return `${ts} [${level}]: ${message} ${metaStr}`;
  }),
);

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' ? json() : consoleFormat,
    }),
  ],
});

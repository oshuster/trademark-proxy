import winston from "winston";
import "dotenv/config";

const LEVEL = process.env.LOG_LEVEL || "info";

// Налаштування форматів логування
const { combine, timestamp, printf } = winston.format;
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Логер для загальних повідомлень
const serviceLogger = winston.createLogger({
  level: LEVEL,
  format: combine(timestamp(), myFormat),
  transports: [new winston.transports.File({ filename: "./logs/service.log" })],
});

// Логер для помилок
const errorLogger = winston.createLogger({
  level: "error",
  format: combine(timestamp(), myFormat),
  transports: [new winston.transports.File({ filename: "./logs/error.log" })],
});

// Логер для запитів та відповідей
const webLogger = winston.createLogger({
  level: LEVEL,
  format: combine(timestamp(), myFormat),
  transports: [new winston.transports.File({ filename: "./logs/web.log" })],
});

// Логування запиту
export const logRequest = (req, _, next) => {
  const { method, url, query } = req;
  const message = `[REQUEST >>>] ${method} ${url} ${JSON.stringify(query)}`;
  webLogger.info(message);

  next();
};

// Логування відповіді
export const logResponse = (res) => {
  const { statusCode, data } = res;
  const message = `[<<< RESPONSE] ${statusCode} ${data}`;
  webLogger.info(message);
};

export { serviceLogger, errorLogger, webLogger };

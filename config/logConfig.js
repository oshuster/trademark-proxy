import winston from "winston";
import "dotenv/config";
import DailyRotateFile from "winston-daily-rotate-file";

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
  transports: [
    new DailyRotateFile({
      filename: "./logs/%DATE%-service.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d", // Зберігати лог-файли протягом 14 днів
    }),
  ],
});

// Логер для помилок
const errorLogger = winston.createLogger({
  level: "error",
  format: combine(timestamp(), myFormat),
  transports: [
    new DailyRotateFile({
      filename: "./logs/%DATE%-error.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
    }),
  ],
});

// Логер для запитів та відповідей
const webLogger = winston.createLogger({
  level: LEVEL,
  format: combine(timestamp(), myFormat),
  transports: [
    new DailyRotateFile({
      filename: "./logs/%DATE%-web.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
    }),
  ],
});

// Логування запиту
export const logRequest = (req, _, next) => {
  const { method, url, query } = req;
  const message = `[REQUEST >>>] ${method} ${url} ${JSON.stringify(query)}\n\n`;
  webLogger.info(message);

  next();
};

// Логування відповіді
export const logResponse = (res) => {
  const { statusCode, data } = res;
  const message = `[<<< RESPONSE] ${statusCode} ${data}\n\n`;
  webLogger.info(message);
};

export { serviceLogger, errorLogger, webLogger };

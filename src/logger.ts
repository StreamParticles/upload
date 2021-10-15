import { NextFunction, Request, Response } from "express";
import { isEmpty, omit } from "lodash";
import { ENV } from "./environment";
import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize, errors, metadata } = format;

const withTimestampFormat = printf(
  ({ level, message, metadata: rawMetadata, timestamp }) => {
    const metadata = omit(rawMetadata, ["timestamp"]);

    return !!metadata && !isEmpty(metadata)
      ? `${timestamp} [${level}]: ${message} ${JSON.stringify(
          metadata,
          null,
          4
        )}`
      : `${timestamp} [${level}]: ${message}`;
  }
);

const loggerFormat = combine(
  colorize(),
  errors({ stack: true }),
  timestamp(),
  withTimestampFormat,
  metadata()
);

const logger = createLogger({
  level: "info",
  format: loggerFormat,
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
  ],
});

if (ENV.ENABLE_CONSOLE_TRANSPORT) {
  logger.add(
    new transports.Console({
      format: loggerFormat,
    })
  );
}

export const requestLoggerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  logger.info(`${req.method} ${req.url}`);

  next();
};

export default logger;

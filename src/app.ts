/* eslint-disable @typescript-eslint/ban-ts-comment */
import express, { Request, Response } from "express";

require("express-async-errors");

import compression from "compression";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
//@ts-ignore
import xss from "xss-clean";

import errorMiddleware from "./error.middleware";
import { requestLoggerMiddleware } from "./logger";
import { uploadMiddleware } from "./upload.middleware";

const app = express();

// set security HTTP headers /\ CAUTION: Override header below if set after /\
app.use(helmet());
app.use(requestLoggerMiddleware);

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1000, // limit each IP to 1000 requests per windowMs
});

app.set("trust proxy", 1);
app.use(limiter);

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

app.post("/upload", uploadMiddleware);

app.use(errorMiddleware);

export default app;

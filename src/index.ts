import http from "http";

import app from "./app";
import { ENV } from "./environment";
import logger from "./logger";

const server = http.createServer(app);

server.listen(ENV.API_PORT, () => {
  logger.info(`Upload manager launched on port : ${ENV.API_PORT}`);
});

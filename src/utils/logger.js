import * as colorette from "colorette";
import pino from "pino";

export const logger = pino({
  timestamp: true,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: colorette.isColorSupported,
    },
  },
});

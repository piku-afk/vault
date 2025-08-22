import { oneLineLogger } from "@fastify/one-line-logger";
import { pino } from "pino";

const { isTTY } = process.stdout;

export const logger = pino(oneLineLogger({ colorize: isTTY }));

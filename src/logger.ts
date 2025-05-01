import "server-only";

export const logger = {
  info: (...args: unknown[]) => {
    console.info("[INFO]", ...args);
  },
};

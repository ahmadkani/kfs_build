import { Logger } from "./../LoggerES6.js";
import { config } from "./../../configES6.js";

const logger = new Logger(config.logging.Versioning);

function consoleDotLog(...params) {
  logger.consoleDotLog(...params);
}

function consoleDotError(...params) {
  logger.consoleDotError(...params);
}

export async function commitVersion({ workerThread, username, email, message }) {
  try {
    if (!workerThread) {
      throw new Error("Invalid or uninitialized workerThread.");
    }

    await workerThread.setConfigs({ username, email });

    await workerThread.commit({
      commitMessage: message || "Default commit from KFS",
    });

    return { success: true };
  } catch (error) {
    consoleDotError("Commit operation failed:", error);
    return { success: false, error };
  }
}

import { Logger } from "./../LoggerES6.js";
import { getConfig } from "./../../configES6.js";

const config = await getConfig();
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

    await workerThread.execute('setConfigs', { username, email})

    await workerThread.execute('commit', {commitMessage: message || "Default commit from KFS"})

    return { success: true };
  } catch (error) {
    consoleDotError("Commit operation failed:", error);
    return { success: false, error };
  }
}

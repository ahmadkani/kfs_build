import { Logger } from "/libs/LoggerES6.js";
import { config } from "/configES6.js";

const logger = new Logger(config.logging.fsType);

function consoleDotLog(...parameters) {
  logger.consoleDotLog(...parameters);
}

function consoleDotError(...parameters) {
  logger.consoleDotError(...parameters);
}

export class FSType {
    constructor() {
      if (new.target === FSType) {
        throw new Error("FSType is an abstract class and cannot be instantiated.");
      }
    }
  
    /**
     * Returns the last error code.
     * Should be overridden in subclasses to provide actual error codes.
     * @returns {number} - Error code.
     */
    async fs_errno() {
      return 0; // Default no error
    }
  
    /**
     * Logs an error description.
     * Can be customized by subclasses.
     * @param {string} p_err_desc - The error description.
     */
    async fs_perror(p_err_desc) {
      consoleDotError("Error:", p_err_desc); // Default behavior: just log the error
    }
  
    /**
     * Changes the current directory.
     * @param {string} path_dir - Directory path to change to.
     * @returns {number} - 0 on success, -1 on error.
     */
    async fs_chdir(path_dir) {
      throw new Error("fs_chdir() is not implemented for this file system.");
    }
  
    /**
     * Retrieves the current working directory.
     * @returns {string} - Current working directory.
     */
    async fs_getcwd() {
      throw new Error("fs_getcwd() is not implemented for this file system.");
    }
  
    /**
     * Opens a directory for reading.
     * @param {string} name_full - The full path of the directory to open.
     * @returns {Object} - Directory object or null on failure.
     */
    async fs_opendir(name_full) {
      throw new Error("fs_opendir() is not implemented for this file system.");
    }
  
    /**
     * Closes the opened directory.
     * @param {Object} p_dir - The directory object.
     */
    async fs_closedir(p_dir) {
      throw new Error("fs_closedir() is not implemented for this file system.");
    }
  
    /**
     * Reads the next directory entry.
     * @param {Object} p_dir - The directory object.
     * @param {Object} p_dir_entry - The directory entry object to populate.
     * @param {Object} pp_result - Result object.
     * @returns {number} - 0 if directory entry is found, -1 if none.
     */
    async fs_readdir_r(p_dir, p_dir_entry, pp_result) {
      throw new Error("fs_readdir_r() is not implemented for this file system.");
    }
  
    /**
     * Creates a directory.
     * @param {string} path - Path to create the directory.
     * @returns {number} - 0 on success, -1 on failure.
     */
    async fs_mkdir(path) {
      throw new Error("fs_mkdir() is not implemented for this file system.");
    }
  
    /**
     * Removes a file or directory.
     * @param {string} path - Path to remove.
     * @returns {number} - 0 on success, -1 on failure.
     */
    async fs_remove(path) {
      throw new Error("fs_remove() is not implemented for this file system.");
    }
  
    /**
     * Renames a file or directory.
     * @param {string} oldPath - Old path.
     * @param {string} newPath - New path.
     * @returns {number} - 0 on success, -1 on failure.
     */
    async fs_rename(oldPath, newPath) {
      throw new Error("fs_rename() is not implemented for this file system.");
    }
  
    /**
     * Removes a directory.
     * @param {string} path - Path to remove.
     * @returns {number} - 0 on success, -1 on failure.
     */
    async fs_rmdir(path) {
      throw new Error("fs_rmdir() is not implemented for this file system.");
    }
  
    /**
     * Retrieves file or directory status.
     * @param {string} path - Path to retrieve status for.
     * @returns {Object} - Status object or null on failure.
     */
    async fs_stat(path) {
      throw new Error("fs_stat() is not implemented for this file system.");
    }
  
    /**
     * Opens a file.
     * @param {string} path - Path to open.
     * @param {string} mode - Mode to open the file in (e.g., 'r', 'w').
     * @returns {number} - File descriptor or null on failure.
     */
    async fs_fopen(path, mode) {
      throw new Error("fs_fopen() is not implemented for this file system.");
    }
  
    /**
     * Closes a file.
     * @param {number} fd - File descriptor.
     * @returns {number} - 0 on success, -1 on failure.
     */
    async fs_fclose(fd) {
      throw new Error("fs_fclose() is not implemented for this file system.");
    }
  
    /**
     * Reads from a file.
     * @param {number} fd - File descriptor.
     * @param {number} length - Number of bytes to read.
     * @returns {string|null} - Read content or null on failure.
     */
    async fs_fread(fd, length) {
      throw new Error("fs_fread() is not implemented for this file system.");
    }
  
    /**
     * Writes to a file.
     * @param {number} fd - File descriptor.
     * @param {string} content - Content to write.
     * @returns {number} - Number of bytes written or -1 on failure.
     */
    async fs_fwrite(fd, content) {
      throw new Error("fs_fwrite() is not implemented for this file system.");
    }
  
    /**
     * Truncates a file.
     * @param {number} fd - File descriptor.
     * @param {number} length - Length to truncate to.
     * @returns {number} - 0 on success, -1 on failure.
     */
    async fs_ftruncate(fd, length) {
      throw new Error("fs_ftruncate() is not implemented for this file system.");
    }
  
    /**
     * Checks if the end of file is reached.
     * @param {number} fd - File descriptor.
     * @returns {boolean} - True if EOF, false otherwise.
     */
    async fs_feof(fd) {
      throw new Error("fs_feof() is not implemented for this file system.");
    }
  
    /**
     * Checks for errors on the file descriptor.
     * @param {number} fd - File descriptor.
     * @returns {boolean} - True if error, false otherwise.
     */
    async fs_ferror(fd) {
      throw new Error("fs_ferror() is not implemented for this file system.");
    }
  
    /**
     * Clears errors on the file descriptor.
     * @param {number} fd - File descriptor.
     */
    async fs_clearerr(fd) {
      throw new Error("fs_clearerr() is not implemented for this file system.");
    }
  
    /**
     * Gets the file position.
     * @param {number} fd - File descriptor.
     * @returns {number} - File position.
     */
    async fs_fgetpos(fd) {
      throw new Error("fs_fgetpos() is not implemented for this file system.");
    }
  
    /**
     * Sets the file position.
     * @param {number} fd - File descriptor.
     * @param {number} pos - Position to set.
     * @returns {number} - 0 on success, -1 on failure.
     */
    async fs_fsetpos(fd, pos) {
      throw new Error("fs_fsetpos() is not implemented for this file system.");
    }
  
    /**
     * Seeks to a position in the file.
     * @param {number} fd - File descriptor.
     * @param {number} offset - Offset to seek to.
     * @param {number} whence - Seek mode.
     * @returns {number} - 0 on success, -1 on failure.
     */
    async fs_fseek(fd, offset, whence) {
      throw new Error("fs_fseek() is not implemented for this file system.");
    }
  
    /**
     * Tells the current position in the file.
     * @param {number} fd - File descriptor.
     * @returns {number} - Current file position.
     */
    async fs_ftell(fd) {
      throw new Error("fs_ftell() is not implemented for this file system.");
    }
  
    /**
     * Rewinds the file to the beginning.
     * @param {number} fd - File descriptor.
     */
    async fs_rewind(fd) {
      throw new Error("fs_rewind() is not implemented for this file system.");
    }
  
    /**
     * Retrieves the file number.
     * @param {number} fd - File descriptor.
     * @returns {number} - File number.
     */
    async fs_fileno(fd) {
      throw new Error("fs_fileno() is not implemented for this file system.");
    }
  
    /**
     * Retrieves the file status.
     * @param {number} fd - File descriptor.
     * @returns {Object} - File status object.
     */
    async fs_fstat(fd) {
      throw new Error("fs_fstat() is not implemented for this file system.");
    }
  
    /**
     * Locks the file descriptor.
     * @param {number} fd - File descriptor.
     */
    async fs_flockfile(fd) {
      throw new Error("fs_flockfile() is not implemented for this file system.");
    }
  
    /**
     * Tries to lock the file descriptor.
     * @param {number} fd - File descriptor.
     * @returns {boolean} - True if locked, false otherwise.
     */
    async fs_ftrylockfile(fd) {
      throw new Error("fs_ftrylockfile() is not implemented for this file system.");
    }
  
    /**
     * Unlocks the file descriptor.
     * @param {number} fd - File descriptor.
     */
    async fs_funlockfile(fd) {
      throw new Error("fs_funlockfile() is not implemented for this file system.");
    }
  
    /**
     * Sets a buffer for the file descriptor.
     * @param {number} fd - File descriptor.
     * @param {Object} buffer - The buffer.
     */
    async fs_setbuf(fd, buffer) {
      throw new Error("fs_setbuf() is not implemented for this file system.");
    }
  
    /**
     * Sets a virtual buffer for the file descriptor.
     * @param {number} fd - File descriptor.
     * @param {Object} buffer - The buffer.
     * @param {number} mode - Buffering mode.
     * @param {number} size - Buffer size.
     */
    async fs_setvbuf(fd, buffer, mode, size) {
      throw new Error("fs_setvbuf() is not implemented for this file system.");
    }
  
    /**
     * Flushes the file.
     * @param {number} fd - File descriptor.
     */
    async fs_fflush(fd) {
      throw new Error("fs_fflush() is not implemented for this file system.");
    }
  }
  
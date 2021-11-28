const fs = require("fs");
const path = require("path");
const dateFormatter = require("./Date.js");

const logsPath = path.join(__dirname, "../../Logs");

class Log {
  constructor() {
    if (fs.existsSync(logsPath) === false) {
      fs.mkdirSync(logsPath);
    }

    this.date = new Date();
    this.writeStream = fs.createWriteStream(
      logsPath + "/" + dateFormatter.isoDate(this.date) + ".log",
      { flags: "a" }
    );
  }

  /**
   * Logs a message to the log file and console.
   * @param {String} level Log Level specified.
   * @param {String} message Message to log.
   * @returns {Promise} Promise that returns once log has written.
   */
  async #log(level, message) {
    if (this.date.getUTCDate() !== new Date().getUTCDate()) {
      this.date = new Date();
      this.writeStream = fs.createWriteStream(
        logsPath + "/" + dateFormatter.isoDate(this.date) + ".log"
      );
    }

    // If stream is not writable (new file etc...) wait until it is.
    if (this.writeStream.writable === false) {
      await new Promise((resolve, reject) => {
        this.writeStream.on("open", () => {
          resolve();
        });
      });
    }

    const logMessage = `[${dateFormatter.isoTime()}] ${level}: ${message}`;

    console.log(logMessage);

    return new Promise((resolve, reject) => {
      this.writeStream.write(logMessage + "\n", () => {
        resolve();
      });
    });
  }

  /**
   * Logs a Warning.
   * @param {String} message Message to log.
   */
  Warn(message) {
    return this.#log(" WARN", message);
  }

  /**
   * Logs a Message.
   * @param {String} message Message to log.
   */
  Info(message) {
    return this.#log(" INFO", message);
  }

  /**
   * Logs an Error.
   * @param {String} message Message to log.
   */
  Error(message) {
    return this.#log("ERROR", message);
  }

  /**
   * Logs a Stack Trace.
   * @param {String} stack Stacktrace to log.
   */
  Stack(stack) {
    return this.#log("FATAL", stack);
  }
}

module.exports = new Log();

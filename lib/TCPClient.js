/**
 * @file TCP Client Class
 * @author Ksidedev
 * @see <a href="./TCPClient.html">TCP Client</a>
 */

const moment = require("moment");
const net = require("net");

const logger = require("./utils/logger");

const logInfo = info => {
    logger.info(`${moment().format("DD/MM/YYYY - HH:mm:ss.SSS")} -- ${info}`);
};

/**
 * TCP Client Class
 */
class TCPClient {

    /**
     * Constructor of the class.
     * @param {Object} options Client options object.
     * @param {String} [options.host=test.spidertracks.com] The host to send the message to.
     * @param {String} [options.port=10001] The host port to send the message to.
     * @param {Number} [options.timeout=30000] The time to wait for a server's response in miliseconds.
     */
    constructor({host = "test.spidertracks.com", port = "10001", timeout = 30000} = {}) {
        this.options = {host, port};
        this.timeout = timeout;
    }

    /**
     * Send a request to the server.
     * @param {String} packet The packet to be sent.
     * @returns {Promise} A Promise resolved or rejected depending on the response from the server.
     */
    request(packet) {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            client.setTimeout(this.timeout);

            client.connect(this.options, () => {
                logInfo(`Connected to ${this.options.host}:${this.options.port}`);
                client.write(Buffer.from(`${packet}\r\n`, "hex"));
            });

            client.on("data", data => {
                logInfo(`Data received from server ${data}`);
                client.destroy(); // kill client after server's response
            });

            client.on("close", () => {
                resolve("All good"); // Only called for the happy path. "error" and "timeout" reject the promise
                logInfo("Connection closed");
            });

            client.on("error", err => {
                logInfo(`Error received - ${err}`);
                client.destroy();
                reject(err);
            });

            client.on("timeout", () => {
                logInfo(`Server did not respond after ${this.timeout} ms`);
                client.destroy();
                reject(new Error(`Server timed out after ${this.timeout} ms`));
            });
        });
    }
}

module.exports = TCPClient;
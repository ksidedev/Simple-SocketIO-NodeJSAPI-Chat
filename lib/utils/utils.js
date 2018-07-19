/**
 * @file Utility functions
 * @author Ksidedev
 * @see <a href="./module-Utils.html">Utils</a>
 */

const moment = require("moment");

/**
 * Get the current timestamp in hexadecimal.
 * @returns {String} The hexadecimal representation of the current timestamp (Epoch time).
 */
const currentTimeInHex = () => {
    return moment().unix().toString(16);
};



// decoder https://github.com/Spidertracks/aws-lambda/blob/develop/point-processing/index.js

module.exports = {
    currentTimeInHex,
};

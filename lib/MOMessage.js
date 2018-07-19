/**
 * @file Message Builder Class
 * @author Ksidedev
 * @see <a href="./MOMessage.html">MOMessage</a>
 */

const userData = require("./utils/userData");
const utils = require("./utils/utils");
const defaults = require("./defaults");

/**
 * Message Builder Class
 */
class MOMessage {

    /**
     * Constructor of the class.
     * @param {Object} props Object that contains the message's properties.
     */
    constructor(props) {
        this.version = props.version || defaults.version;
        this.date = defaults.date;
    }

    /**
     * Generate the MO Payload IE.
     * @returns {String} The MO Payload IE which contains the STL Payload.
     */
    getMOPayloadIE() {
        const MOPayloadIEI = "02";
        const hdop = "36";
        const MOPayloadIE = `${MOPayloadIEI}`;
        return MOPayloadIE;
    }
}

module.exports = MOMessage;



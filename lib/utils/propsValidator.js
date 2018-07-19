const { body, validationResult } = require("express-validator/check");

const utils = require("./utils");
const userData = require("./userData");
const availableUserData = [...Object.keys(userData), "custom"];

const nameValidation = body("name").trim()
    .exists().matches(/^[_a-zA-Z][_a-zA-Z0-9_ ]*$/).withMessage("Name must be provided");

const messageValidation = body("message").trim()
    .exists().matches(/^[_a-zA-Z][_a-zA-Z0-9_ ]*$/).withMessage("Message must be provided");


const propsValidator = [
    messageValidation,
    nameValidation
];

const validationResultFormatted = validationResult.withDefaults({
    formatter: ({ value, msg, nestedErrors }) => (
        {
            value, msg, nestedErrors
        }
    )
});

module.exports = { propsValidator, validationResultFormatted };

import schemas from '../validators/schema.validator';
import { StatusCodes } from 'http-status-codes';
const supportedMethods = ["post", "put", "patch", "delete"];
const validationOptions = {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: false
};
const schemaValidator = (path, useJoiError = true) => {
    const schema = schemas[path];
    if (!schema) {
        throw new Error(`Schema not found for path: ${path}`);
    }
    return (req, res, next) => {
        const method = req.method.toLowerCase();
        if (!supportedMethods.includes(method)) {
            return next();
        }
        const { error, value } = schema.validate(req.body, validationOptions);
        if (error) {
            const customError = {
                status: "failed",
                error: "Invalid request. Please review request and try again.",
            };
            const joiError = {
                status: "failed",
                error: {
                    original: error.details.length > 0 ? req.body : undefined,
                    details: error.details.map(({ message, type }) => ({
                        message: message.replace(/['"]/g, ""),
                        type,
                    })),
                },
            };
            return res.status(StatusCodes.BAD_REQUEST).json(useJoiError ? joiError :
                customError);
        }
        req.body = value;
        return next();
    };
};
export default schemaValidator;
//# sourceMappingURL=schemaValidator.js.map
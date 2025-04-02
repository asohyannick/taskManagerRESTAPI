import { StatusCodes } from 'http-status-codes';
const notFoundMiddleware = (req, res) => {
    return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        status: StatusCodes.NOT_FOUND,
        message: "Route does not exist!"
    });
};
export default notFoundMiddleware;
//# sourceMappingURL=404handler.js.map
module.exports = function (handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        } catch (error) {
            //We are pretty much passing the error to the middleware which handles errors | at the end of all 
            //middlewares
            next(error);
        }
    };
}
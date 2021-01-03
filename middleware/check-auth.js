const HttpError = require("../model/http-error");
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(!token) {
            throw new Error('Error al autentificar');
        }
        const decodedToken = jwt.verify(token, 'token_secreto_no_compartir');
        req.userData = { userId: decodedToken.userId };
        next();
    } catch (err) {
        const error = new HttpError('Error al autentificar', 401);
        return next(error);
    }
};
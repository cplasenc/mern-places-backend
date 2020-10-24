class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); //añade la propiedad message
        this.code = errorCode; //añade la propiedad code
    }
}

module.exports = HttpError;
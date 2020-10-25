const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('./model/http-error');
const placesRoutes = require('./routes/places-routes');
const usersRouter = require('./routes/users-routes');
const server = express();

server.use(bodyParser.json());

server.use('/api/places', placesRoutes);
server.use('api/users', usersRotes);

server.use((req, res, next) => {
    const error = new HttpError('No se ha encontrada nada en esta dirección', 404);
    throw error;
});

server.use((error, req, res, next) => {
    if(res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'Error inesperado'});
});

server.listen(5000);
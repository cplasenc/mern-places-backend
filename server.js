const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('./model/http-error');
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const mongoose = require('mongoose');

const DB_STRING = process.env.DB_STRING;

const server = express();

server.use(bodyParser.json());

server.use('/api/places', placesRoutes);
server.use('/api/users', usersRoutes);

server.use((req, res, next) => {
    const error = new HttpError('No se ha encontrada nada en esta dirección', 404);
    throw error;
});

server.use((error, req, res, next) => {
    if(res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'Error inesperado'});
});

mongoose
    .connect(DB_STRING)
    .then(() => {
        server.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });

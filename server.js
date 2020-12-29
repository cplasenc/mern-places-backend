const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('./model/http-error');
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const mongoose = require('mongoose');
const fs = require('fs');

const DB_STRING = process.env.DB_STRING;

const server = express();

server.use(bodyParser.json());

server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

server.use('/api/places', placesRoutes);
server.use('/api/users', usersRoutes);

server.use((req, res, next) => {
    const error = new HttpError('No se ha encontrada nada en esta dirección', 404);
    throw error;
});

server.use((error, req, res, next) => {
    if(req.file) {
        fs.unlink(req.file.path, (err) => {
            console.log(err);
        });
    }
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
 
const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');

const server = express();

server.use(bodyParser.json());

server.use('/api/places', placesRoutes);

server.use((error, req, res, next) => {
    if(res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'Error inesperado'});
});

server.listen(5000);
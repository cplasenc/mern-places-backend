const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');

const server = express();

server.use('/api/places', placesRoutes);

server.listen(5000);
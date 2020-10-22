const express = require('express');

const router = express.Router();

const DUMMY_PLACES = [
    {
        id: '1',
        title: 'titulo',
        descriptiom: 'descripcion',
        location: {
            lat: 40.7484,
            lng: -73.9871
        },
        adress: 'direccion',
        creator: 'u1' 
    }
]


module.exports = router;
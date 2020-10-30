require('dotenv').config();
const axios = require('axios');
const HttpError = require('../model/http-error');

const API_KEY = process.env.API_KEY;

async function getCoordsForAdress(address) {
    
    const response = await axios.get (
        (`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`)
        );

        const data = response.data;

        if(!data || data.status === 'ZERO_RESULTS') {
            const error = new HttpError('No se ha podido encontrar una ubicación para la dirección especificada', 422);
            throw error;
        }

        const coordinates = data.results[0].geometry.location;

        return coordinates;
}

module.exports = getCoordsForAdress;
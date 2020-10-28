const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placesSchema = new Schema({
    title: { type: String, requird: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    address: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    creator: { type: String, required: true }
});

module.exports = mongoose.model('Place', placesSchema);
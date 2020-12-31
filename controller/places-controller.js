const HttpError = require('../model/http-error');
const { validationResult } = require('express-validator');
const getCoordsForAddress = require('../util/location');
const Place = require('../model/place');
const User = require('../model/user');
const mongoose = require('mongoose');

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError("No se ha podido encontrar un lugar", 500);
        return next(error);
    }

    if (!place) {
        const error = new HttpError('No se ha encontrado ningún lugar con esa id', 404);
        return next(error);
    }

    res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let places;
    try {
        places = await Place.find({ creator: userId });

    } catch (err) {
        const error = new HttpError('Error al cargar. Inténtalo de nuevo', 500);
        return next(error);
    }

    if (!places || places.length === 0) {
        return next(new HttpError('No se ha encontrado ningún lugar', 404));
    }

    res.json({ places: places.map(place => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Input inválido', 422));
    }

    const { title, description, address, creator } = req.body;

    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: req.file.path,
        creator
    });

    let user;
    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError('Error al crear lugar', 500);
        return next(error);
    }

    if (!user) {
        const error = new HttpError('No se ha podido encontrar un usuario con esa Id', 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({ session: sess });
        user.places.push(createdPlace);
        await user.save({ session: sess });
        await sess.commitTransaction();

    } catch (err) {
        const error = new HttpError(
            'Error al crear un lugar', 500
        );
        return next(error);
    }

    res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Input inválido', 422));
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('Error al actualizar', 500);
        return next(error);
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (err) {
        const error = new HttpError('Error al actualizar', 500);
        return next(error);
    }

    res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
    } catch (err) {
        const error = new HttpError('Error al eliminar', 500);
        return next(error);
    }

    if (!place) {
        const error = new HttpError('No se ha podido encontrar un lugar para esta Id', 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({ session: sess });
        place.creator.places.pull(place);
        await place.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Error al eliminar', 500);
        return next(error);
    }

    res.status(200).json({ message: 'Lugar eliminado' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
const uuid = require('uuid').v4;
const { validationResult } = require('express-validator');
const HttpError = require('../model/http-error');
const User = require('../model/user');

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'nombre',
        email: 'test@mail.com',
        password: 'testers'
    }
]

const getUsers = (req, res, next) => {
    res.json({users: DUMMY_USERS});
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return  next(new HttpError('Input inválido', 422));
    }
    const { name, email, password, places } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email })
    } catch(err) {
        const error = new HttpError('Error al registrarte', 500);
        return next(error);
    }

    if(existingUser) {
        const error = new HttpError('Este usuario ya existe. Por favor inicia sesión', 422);
        return next(error);
    }

    const createdUser = new User({
        name, 
        email,
        image: 'https://s3-us-west-2.amazonaws.com/lasaga-blog/media/images/grupo_imagen.original.jpg',
        password,
        places
    });

    try {
        await createdUser.save();
    } catch(err) {
        const error = new HttpError('Error al crear usuario', 500);
        return next(error);
    };

    res.status(201).json({user: createdUser.toObject({ getters: true })});
};

const login = (req, res, next) => {
    const { email, password } = req.body;

    const identifiedUser = DUMMY_USERS.find(u => u.email === email);
    if(!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError('Error al iniciar sesión', 401);
    }

    res.json({message: 'Sesión iniciada'});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
const uuid = require('uuid').v4;
const { validationResult } = require('express-validator');
const HttpError = require('../model/http-error');

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

const signup = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        throw new HttpError('Input inválido', 422);
    }
    const { name, email, password } = req.body;

    const hasUser = DUMMY_USERS.find(u => u.email === email);
    if(hasUser) {
        throw new HttpError('Este correo electrónico ya está registrado', 422);
    }

    const createdUser = {
        id: uuid(),
        name,
        email,
        password
    };

    DUMMY_USERS.push(createdUser);

    res.status(201).json({user: createdUser});
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
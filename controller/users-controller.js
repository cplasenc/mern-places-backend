const uuid = require('uuid');
const HttpError = require('../model/http-error');
const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'nombre',
        email: 'test@mail.com',
        password: 'testers';
    }
]

const getUsers = (req, res, next) => {
    res.json({users: DUMMY_USERS});
};

const signup = (req, res, next) => {
    const { name, email, password } = req.body;

    const hasUser = DUMMY_USERS.find(u => u.email === email);
    if(hasUser) {
        throw new HttpError('Este correo electrónico ya está registrado', 422);
    }

    const createdUSer = {
        id: uuid(),
        name,
        email,
        password
    };

    DUMMY_USERS.push(createdUSer);

    res.status(201).json({user: createdUSer});
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
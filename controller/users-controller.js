const { validationResult } = require('express-validator');
const HttpError = require('../model/http-error');
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch(err) {
        const error = new HttpError('Error al recuperar usuarios', 500);
        return next(error);
    }
    res.json({users: users.map(user => user.toObject({ getters: true }))});
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return  next(new HttpError('Input inválido', 422));
    }
    
    const { name, email, password } = req.body;

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

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError('Error al crear usuario', 500);
        return next(error);
    }

    const createdUser = new User({
        name, 
        email,
        image: req.file.path,
        password: hashedPassword,
        places: []
    });

    try {
        await createdUser.save();
    } catch(err) {
        const error = new HttpError('Error al crear usuario', 500);
        return next(error);
    };

    let token;
    try {
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email }, 
            'token_secreto_no_compartir',
            {expiresIn: '1h'}
        );            
    } catch (err) {
        const error = new HttpError('Error al crear usuario', 500);
        return next(error); 
    }

    res.status(201).json({user: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email })
    } catch(err) {
        const error = new HttpError('Error al iniciar sesión', 500);
        return next(error);
    }

    if(!existingUser) {
        const error = new HttpError('El email o la contraseña no son correctos', 403);
        return next(error);
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new HttpError('Se ha producido un error en la autentificación', 500);
        return next(error);
    }

    if(!isValidPassword) {
        try {
            existingUser = await User.findOne({ email: email })
        } catch(err) {
            const error = new HttpError('Error al iniciar sesión', 500);
            return next(error);
        }
    }

    let token;
    try {
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email }, 
            'token_secreto_no_compartir',
            {expiresIn: '1h'}
        );            
    } catch (err) {
        const error = new HttpError('Error al iniciar sesión', 500);
        return next(error); 
    }

    res.json({ userId: existingUser.id, email: existingUser.email, token: token });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
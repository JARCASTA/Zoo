'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var mdAuth = require('../middlewares/authenticade');
var api = express.Router();
var connectMultiparty = require('connect-multiparty');//Manejo de archivos en la solicitud
var mdUpload = connectMultiparty({uploadDir: './uploads/users'});

api.post('/saveUser', userController.saveUser);
api.post('/login', userController.login);

api.get('/pruebaMiddleware', mdAuth.ensureAuth, userController.pruebaMiddleWare);
api.put('/updateUser/:id', mdAuth.ensureAuth, userController.updateUser);
api.put('/uploadImageUser/:id', [mdAuth.ensureAuth, mdUpload], userController.uploadImage );
api.get('/getImageUser/:id/:image', [mdAuth.ensureAuth, mdUpload], userController.getImage);
api.delete('/deleteUser/:id', mdAuth.ensureAuth, userController.deleteUser);

api.get('/listUsers',mdAuth.ensureAuthAdmin, userController.listUsers);

module.exports = api;
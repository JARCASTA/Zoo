'use strict'

var express = require('express');
var animalController = require('../controllers/animal.controller');
var mdAuth = require('../middlewares/authenticade');
var api = express.Router();
var connectMultiparty = require('connect-multiparty');//Manejo de archivos en la solicitud
var mdUpload = connectMultiparty({uploadDir: './uploads/animals'});

api.post('/saveAnimal', mdAuth.ensureAuthAdmin, animalController.saveAnimal);
api.put('/updateAnimal/:id', mdAuth.ensureAuthAdmin, animalController.updateAnimal);
api.delete('/deleteAnimal/:id', mdAuth.ensureAuthAdmin, animalController.deleteAnimal);
api.put('/uploadImageAnimal/:id', [mdAuth.ensureAuthAdmin, mdUpload], animalController.uploadImage );
api.get('/getImageAnimal/:id/:image', [mdAuth.ensureAuthAdmin, mdUpload], animalController.getImage);

api.get('/listAnimals', mdAuth.ensureAuth, animalController.listAnimals);
api.get('/getAnimal', mdAuth.ensureAuth, animalController.getAnimal);

module.exports = api;
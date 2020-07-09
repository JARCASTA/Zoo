'use strict'

var Animal = require('../models/animal.model');

//jwt
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

function saveAnimal(req,res){
    var animal = new Animal();
    var params = req.body;

        if(params.name && params.nickName && params.age && params.carer){
            Animal.findOne({nickName: params.nickName}, (err, animalFind)=>{
                if(err){
                    res.status(500).send({message:'Error general'});
                }else if(animalFind){
                    res.send({message:'Apodo ya en uso'});
                }else{
                    animal.name = params.name;
                    animal.nickName = params.nickName;
                    animal.age = params.age;
                    animal.carer = params.carer;

                    animal.save(animal, (err, animalSaved)=>{
                        if(err){
                            res.status(500).send({message:'Error general'});
                        }else if (animalSaved){
                             res.send({animals: animalSaved});
                        }else{
                            res.status(404).send({message:'No se pudo guardar al animal'});
                        }
                    })
                }
            })
        }else{
            res.send({message:'Ingrese todos los campos'});
        }
}

function updateAnimal(req,res){
    var animalId = req.params.id;
    var update = req.body;

    Animal.findByIdAndUpdate(animalId, update, {new:true}, (err, animalUpdated)=>{
        if(err){
            res.status(500).send({message:'Error general'});
        }else if(animalUpdated){
            res.send({animal: animalUpdated});
        }else{
            res.status(404).send({message:'No se ha podido actualizar'});
        }
    })
}

function deleteAnimal(req, res){
    var animalId = req.params.id;
    Animal.findByIdAndRemove(animalId, (err, animalRemoved)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else if(animalRemoved){
            res.send({message:'Se a eliminado al siguiente animal: ', animalRemoved});
        }else{
            res.status(404).send({message: 'Error al tratar de eliminar'});
        }
    })
}

function uploadImage(req, res){
    var animalId = req.params.id;
    var file = 'No subido';


        if(req.files){
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('\\');
            var fileName = fileSplit[2];
    
            var ext = fileName.split('\.');
            var fileExt = ext[1]; 

            if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
                Animal.findByIdAndUpdate(animalId, {image: fileName}, {new: true}, (err, animalUpdated)=>{
                    if(err){
                        res.status(500).send({message:'Error general'});
                    }else if(animalUpdated){
                        res.send({animal: animalUpdated});
                    }else{
                        res.status(418).send({message:'No se pudo actualizar'});
                    }
                })
            }else{
                fs.unlink(filePath, (err)=>{
                   if(err){
                        res.status(418).send({message:'Extension de archivo no admitida y archivo no eliminado'}); 
                   }else{
                        res.status(418).send({message:'Extension de archivo no admitida y archivo eliminado'});
                   }
                })
                
            }
        }else{
            res.status(404).send({message:'Archivo no encontrado'});
        }  
}

function getImage(req, res){
    var animalId = req.params.id;
    var fileName = req.params.image;
    var pathFile = './uploads/animals/'+fileName;

    fs.exists(pathFile, (exists)=>{
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(404).send({message:'Imagen inexistente'});
        }
    })

}

function listAnimals(req,res){
    Animal.find({}, (err, animalsFinded)=>{
        if(err){
            res.status(500).send({message:'Error general'});
        }else if(animalsFinded){
            res.send({animalsFinded});
        }else{
            res.status(404).send({message:'No se encontraron animales'}); 
        }
    })
}

function getAnimal(req,res){
    var params = req.body;

    Animal.findById(params.id, (err, animalFind) =>{
        if(err){
            res.status(500).send({message:'Error general'});
        }else if(animalFind){
            res.send({animal: animalFind});
        }else{
            res.status(404).send('Animal no encontrado');
        }
    })

}

module.exports = {
    saveAnimal,
    updateAnimal,
    deleteAnimal,
    uploadImage,
    getImage,
    listAnimals,
    getAnimal
}
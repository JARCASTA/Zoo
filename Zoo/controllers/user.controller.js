'use strict'

var User = require('../models/user.model');
//bcrypt encriptar contrasenia
var bcrypt = require('bcrypt-nodejs');
//jwt
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

function saveUser(req,res){
    var user = new User();
    var params = req.body;

    if(params.name && params.userName && params.email && params.password){
        User.findOne({$or:[{userName: params.userName}, {email:params.email}]}, (err, userFind)=>{
            if(err){
                res.status(500).send({message:'Error general'});
            }else if(userFind){
                res.send({message:'Usuario o email ya existentes'});
            }else{
                user.name = params.name;
                user.userName = params.userName;
                user.email = params.email;
                user.role = params.role;

                bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                    if(err){
                        res.status(500).send({message:'Error al encriptar contrasenia'});
                    }else if(passwordHash){
                        user.password = passwordHash;
                        user.save(user, (err, userSaved)=>{
                            if(err){
                                res.status(500).send({message:'Error general'});
                            }else if (userSaved){
                                res.send({user: userSaved});
                            }else{
                                res.status(404).send({message:'No se pudo guardar al usuario'});
                            }
                        })
                    }else{
                        res.status(418).send({message:'Error no esperado'});
                    }
                })


            }
        })
    }else{
        res.send({message:'Ingrese todos los campos'});
    }
}

function login(req, res){
    var params = req.body;

    if(params.userName || params.email){
        if(params.password){
            User.findOne({$or:[{userName: params.userName}, {email:params.email}]}, (err, check)=>{
                if(err){
                    res.status(500).send({message:'Error general'});
                }else if(check){
                    bcrypt.compare(params.password, check.password, (err, passwordOk)=>{
                        if(err){
                            res.status(500).send({message:'Error al comparar'});
                        }else if(passwordOk){
                            if(params.getToken = true){
                                res.send({token: jwt.createToken(check)})
                            }else{
                                res.send({message:'Bienvenido', user:check});
                            }
                        }else{
                            res.send({message:'Contrasenia incorrecta'});
                        }
                    })
                }else{
                    res.send({message:'Datos de usuario incorrectos'})
                }
            })
        }else{
            res.send({message:'Ingrese su contrasenia'})
        }
    }else {
        res.send({message:'Ingrese su correo o usuario'});
    }
}

function pruebaMiddleWare(req, res){
    res.send({message:'Prueba de middleware correcta'});
}

function updateUser(req,res){
    var userId = req.params.id;
    var update = req.body;

    if(userId != req.user.sub){
        res.status(403).send({message:'Error de permisos para esta ruta'});
    }else{
        User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdated)=>{
            if(err){
                res.status(500).send({message:'Error general'});
            }else if(userUpdated){
                res.send({user: userUpdated});
            }else{
                res.status(404).send({message:'No se ha podido actualizar'});
            }
        })
    }
}

function uploadImage(req, res){
    var userId = req.params.id;
    var file = 'No subido';

    if(userId != req.user.sub){
        res.status(403).send({message:'Error de permisos para esta ruta'});
    }else{
        if(req.files){
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('\\');
            var fileName = fileSplit[2];
    
            var ext = fileName.split('\.');
            var fileExt = ext[1]; 

            if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
                User.findByIdAndUpdate(userId, {image: fileName}, {new: true}, (err, userUpdated)=>{
                    if(err){
                        res.status(500).send({message:'Error general'});
                    }else if(userUpdated){
                        res.send({user: userUpdated});
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
            res.status(404).send({message:'Archivo no encontrado'})
        }
    }

    
}

function getImage(req, res){
    var userId = req.params.id;
    var fileName = req.params.image;
    var pathFile = './uploads/users/'+fileName;

    fs.exists(pathFile, (exists)=>{
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(404).send({message:'Imagen inexistente'})
        }
    });

}

function listUsers(req,res){
    User.find({}), (err, usersFinded)=>{
        if(err){
            res.status(500).send({message:'Error general'});
        }else if(usersFinded){
            res.send({usersFinded});
        }else{
            res.status(404).send({message:'No se encontraron usuarios'})
        }
    }
}

function deleteUser(req, res){
    var userId = req.params.id;
    if(userId == req.user.sub){
        User.findByIdAndRemove(userId, (err, userRemoved)=>{
            if(err){
                res.status(500).send({message: 'Error general'});
            }else if(userRemoved){
                res.send({message:'Se a eliminado al siguiente usuario: ', userRemoved});
            }else{
                res.status(404).send({message: 'Error al tratar de eliminar'});
            }
        })
    }else if(userId != req.user.sub){
        res.send({message:'Error al borrar'});
    }
}

module.exports = {
    saveUser,
    login,
    pruebaMiddleWare,
    updateUser,
    uploadImage,
    getImage,
    listUsers,
    deleteUser
}
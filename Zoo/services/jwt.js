'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'clave_12345';


exports.createToken = (user) =>{
    var payload = {
        sub: user._id,
        name: user.name,
        userName: user.userName,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(15, "minutes").unix() 
    }
    return jwt.encode(payload, key)
}

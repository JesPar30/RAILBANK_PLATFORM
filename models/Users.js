const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require("bcryptjs");

let UserSchema = new Schema({
    NOMBRE: {type: String, required: true, max: 100},
    EMAIL: {type: String, required: true, max: 100},
    CONTRASENA: {type: String, required: true, max: 100},
    DNI: {type: Number, required: true},
    CUIT: {type: Number, required: true},
    CARGO: {type: String, required: true, max: 100},
    PRIVILEGIO: {type: Number, required: true},
    fechaCreacion: { type: Date, default: Date.now }
});

UserSchema.methods.encryptPassword = async CONTRASENA => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(CONTRASENA, salt);
  };
  
  UserSchema.methods.matchPassword = async (CONTRASENA) => {
    return await bcrypt.compare(CONTRASENA, this.CONTRASENA);
  };

module.exports = mongoose.model('USER', UserSchema);
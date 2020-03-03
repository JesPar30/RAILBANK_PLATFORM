const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const USER = require('../models/Users'); 

 passport.use(new LocalStrategy({
  usernameField: 'EMAIL',
  passwordField: 'CONTRASENA'
}, async (EMAIL, CONTRASENA, done) => {

  const user = await USER.findOne({EMAIL: EMAIL})
  if (!user) {
    console.log('usuario no encontrado');
    
    return done (null,false, {message:'USUARIO NO ENCONTRADO'}) 
  }else{
    const match = await user.matchPassword(CONTRASENA)
    if (match) {
      console.log('sesion iniciada ' + user);
      return done(null,user)
    
    } else {
      return done(null,false, {message:'CONTRASEÑA INCORRECTA'})
    }
  }

}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  USER.findById(id, (err, user) => {
    done(err, user);
  });
});
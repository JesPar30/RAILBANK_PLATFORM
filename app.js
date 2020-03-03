const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars')
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const mongoDB = 'mongodb+srv://jespar:343434j.@cluster0-gx61s.gcp.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const indexRouter = require('./routes/index');
const userRouter = require('./routes/Users');
const frRouter = require('./routes/fr');

const app = express();
require('./config/passport');
// view engine setup

const hbs = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers:{
    vistaUsuarios: function(cargoUsuario, options) {
      jerarquiaAdministrador = 'Administrador';
      jerarquiaGerente = 'Gerente';
      jerarquiaCoordinador = 'Coordinador';
      jerarquiaSupervisor = 'Supervisor';
      jerarquiaAdministrativo = 'Administrativo';
      if (cargoUsuario == jerarquiaAdministrador||cargoUsuario == jerarquiaGerente
        ||cargoUsuario == jerarquiaCoordinador||cargoUsuario == jerarquiaSupervisor
        ||cargoUsuario == jerarquiaAdministrativo) {
          return options.fn(this);
      }
      return options.inverse(this); 
  }
  }
})

app.engine('.hbs',hbs.engine);
app.set('view engine', '.hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//GLOBAL VARIABLES
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  console.log(req.user)
  console.log(res.locals.user)
  next();
});



//ROUTES

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/fr', frRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

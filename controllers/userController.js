const mongoose = require('mongoose');
const USER = require("../models/Users");
const passport = require("passport");

let userController = {};

userController.list = function (req, res) {

    USER.find({}).exec(function (err, user) {
        if (err) { console.log('Error: ', err); return; }
        console.log("The INDEX");
        res.render('../views/user/index', { user: user });

    });

};


userController.show = function (req, res) {
    USER.findOne({ _id: req.params.id }).exec(function (err, user) {
        if (err) { console.log('Error: ', err); return; }

        res.render('../views/user/show', { user: user });
    });

};

userController.loginForm = function (req, res) {
    res.render('../views/login');
};

userController.loginInit = passport.authenticate('local', {
    successRedirect: "/inicio",
    failureRedirect: "/login",
    failureFlash: true
  });



userController.create = function (req, res) {
    res.render('../views/user/create');
};

userController.save = async (req, res) => {
    let errors = [];
    const { NOMBRE, EMAIL, CONTRASENA, DNI, CUIT, CARGO, PRIVILEGIO } = req.body;

    if (CONTRASENA.length < 4) {
        errors.push({ text: "Passwords must be at least 4 characters." });
    }
    if (errors.length > 0) {
        res.render("user/create", {
            errors,
            NOMBRE,
            EMAIL,
            CONTRASENA,
            DNI,
            CUIT,
            CARGO,
            PRIVILEGIO
        });
    } else {
        // Look for email coincidence
        const emailUser = await USER.findOne({ EMAIL: EMAIL });
        if (emailUser) {
            req.flash("error_msg", "The Email is already in use.");
            res.redirect("/user/create");
        } else {
            // Saving a New User
            const newUser = new USER({ NOMBRE, EMAIL, CONTRASENA, DNI, CUIT, CARGO, PRIVILEGIO });
            newUser.CONTRASENA = await newUser.encryptPassword(CONTRASENA);
            await newUser.save();
            req.flash("success_msg", "Usuario Registrado");
            res.redirect("/user/show/" + newUser._id);
        }
    }
};




/* function (req, res) {
    var user = new USER(req.body);

    user.save(function (err) {
        if (err) { console.log('Error: ', err); return; }

        console.log("Successfully created a product. :)");
        res.redirect("/user/show/" + user._id);

    });
}; */

userController.edit = function (req, res) {
    USER.findOne({ _id: req.params.id }).exec(function (err, user) {
        if (err) { console.log("Error:", err); return; }

        res.render("../views/user/edit", { user: user });

    });
};


userController.update = function (req, res) {
    USER.findByIdAndUpdate(req.params.id, {
        $set: {
            NOMBRE: req.body.NOMBRE,
            EMAIL: req.body.EMAIL,
            CONTRASENA: req.body.CONTRASENA,
            DNI: req.body.DNI,
            CUIT: req.body.CUIT,
            CARGO: req.body.CARGO,
            PRIVILEGIO: privi
        }
    }, { new: true },
        function (err, user) {
            if (err) {
                console.log('Error: ', err);
                res.render('../views/user/edit', { user: req.body });
            }

            console.log(user);

            res.redirect('/user/show/' + user._id);

        });
};
userController.delete = function (req, res) {

    USER.remove({ _id: req.params.id }, function (err) {
        if (err) { console.log('Error: ', err); return; }

        console.log("Product deleted!");
        res.redirect("/user");
    });

};
userController.logout = (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out now.");
    res.redirect("/");
  };

/*
 * Other actions
 */

module.exports = userController;
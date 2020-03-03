const helpers = {};

Handlebars.registerHelper('isAdministrator', function(cargoUsuario,jerarquia, options) {

    if (jerarquia == cargoUsuario) {
        return options.fn(this);
    }
    return options.inverse(this); 
});

module.exports = helpers;
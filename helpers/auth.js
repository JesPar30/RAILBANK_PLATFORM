const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Not Authorized.');
  res.redirect('/login');
};

helpers.isNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/inicio')
}
next()
};

module.exports = helpers;
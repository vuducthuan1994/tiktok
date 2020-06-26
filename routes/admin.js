const express = require('express');
let router = express.Router();


var isAuthenticated = function(req, res, next) {
    if (process.env.ENV == 'DEV') {
        return next();
    }
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}



const proxy = require('./admin/proxy');
const user = require('./admin/users');
const configGeneral = require('./admin/general');


router.use('/proxy', proxy);
router.use('/users', user);
router.use('/general', configGeneral);

router.get('/', isAuthenticated, function(req, res) {
    res.redirect('/admin/proxy');
});

module.exports = router;
var express = require('express');
var router = express.Router();
const Proxys = require('../../models/proxyModel');
var isAuthenticated = function(req, res, next) {
    if (process.env.ENV == 'DEV') {
        return next();
    }
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}



router.get('/', function(req, res) {
    Proxys.find({}, function(err, proxys) {
        res.render('admin/proxy/index', { messages: req.flash('message'), title: "Proxy", proxys: proxys.map(proxy => proxy.toJSON()), layout: 'admin.hbs' });
    }).sort({ updated_date: -1 });
});
router.get('/add-proxy', isAuthenticated, function(req, res) {
    // res.locals.originalUrl = req.originalUrl;
    res.render('admin/proxy/add-proxy', { title: "Add Proxy", layout: 'admin.hbs' });
});

router.get('/delete/:id', isAuthenticated, function(req, res) {
    const id = req.params.id;
    Proxys.remove({
        _id: id,
    }, function(err) {
        if (!err) {
            req.flash('message', 'Delete Proxy Success !')
            res.redirect('back');
        } else {
            req.flash('message', 'Delete Proxy Fail ! !')
            res.redirect('back');
        }
    });
});
router.post('/add-proxy', isAuthenticated, function(req, res) {
    const proxy = req.body.proxy.split(':');
    if (proxy.length < 5) {
        req.flash('message', 'Điền thiếu field')
        const errors = req.flash('message');
        res.locals.errors = errors;
        res.render('admin/proxy/add-proxy', { title: "Add Proxy", layout: 'admin.hbs' });
    } else {
        Proxys.create({
            protocol: proxy[0] ? proxy[0] : 'http',
            user: proxy[1],
            password: proxy[2],
            ip: proxy[3],
            port: proxy[4],
            status: true,
            created_date: new Date(),
            updated_date: new Date()
        }, function(err, data) {
            if (!err) {
                res.redirect('admin/proxy');
            }
        });
    }
});
module.exports = router;
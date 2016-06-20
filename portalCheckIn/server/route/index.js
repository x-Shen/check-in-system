 var express             = require('express'),
    router              = express.Router();


router.use(express.static('./public/'));

// Get the home page
router.get('/', function (req, res) {
    res.sendfile('./public/views/index.html');
});

// Get the checkin page
router.get('/checkin_login.html', function(req, res) {
    res.sendfile('./public/views/checkin_login.html');
});

router.get('/checkin_confirmation.html', function(req, res) {
    res.sendfile('./public/views/checkin_confirmation.html');
});

router.get('/adminViewPage.html',function(req,res){
   res.sendfile('./public/views/adminViewPage.html');
});

// get the checkout page
router.get('/checkout_login.html', function(req, res) {
    res.sendfile('./public/views/checkout_login.html');
});

// get the checkout page
router.get('/checkout_confirmation.html', function(req, res) {
    res.sendfile('./public/views/checkout_confirmation.html');
});

// get the admin login page
router.get('/admin.html', function(req, res) {
    res.sendfile('./public/views/admin.html');
});

module.exports = router;

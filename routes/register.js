var mongoose=require('mongoose'),
    Schema = mongoose.Schema;


var address= new Schema({
	addressName: String,
    address: String,
    zipcode: String,
    recipient: String,
    phoneNumber: String
});




module.exports = function ( app ) {
    app.get('/register', function(req, res) {
        res.render('register');
    });

    app.post('/register', function (req, res) {
        var User = global.dbHelper.getModel('user'),
            uname = req.body.uname;
        User.findOne({name: uname}, function (error, doc) {
            if (error) {
                res.send(500);
                req.session.error = 'Error';
                console.log(error);
            } else if (doc) {
                req.session.error = 'Username already exists';
                res.send(500);
            } else {
                User.create({
                    name: uname,
                    password: req.body.upwd,
                    addressBook: [mongoose.model('address',address)]
                }, function (error, doc) {
                    if (error) {
                        res.send(500);
                        console.log(error);
                    } else {
                        req.session.error = 'Successfully Registered';
                        res.send(200);
                    }
                });
            }
        });
    });
}
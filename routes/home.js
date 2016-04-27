module.exports = function ( app ) {
    app.get('/home', function (req, res) {
        if(req.session.user){
            var Commodity = global.dbHelper.getModel('commodity');
            Commodity.find({}, function (error, docs) {
                res.render('home',{Commoditys:docs});
            });
        }else{
            req.session.error = "Please log in to browse website"
            res.redirect('/login');
        }
    });
    app.get('/addcommodity', function(req, res) {
        res.render('addcommodity');
    });
    app.post('/addcommodity', function (req, res) {
        var Commodity = global.dbHelper.getModel('commodity');
        Commodity.create({
            name: req.body.name,
            price: req.body.price,
            imgSrc: req.body.imgSrc
        }, function (error, doc) {
            if (doc) {
                res.send(200);
            }else{
                res.send(404);
            }
        });
    });
    
    app.get('/productDetails/:id', function(req, res) {
        var User = global.dbHelper.getModel('user');
        var Commodity = global.dbHelper.getModel('commodity');
        if(!req.session.user){
            req.session.error = "Operation timed out: Please log in again"
            res.redirect('/login');
        }else{
            Commodity.findOne({"_id":req.params.id}, function (error, docs) {
                res.render('productDetails.html',{uId:req.session.user._id, commodity:docs});
            });
        }
    });
    
    app.post('/productDetails/addComment', function(req, res) {
        var User = global.dbHelper.getModel('user');
        var Commodity = global.dbHelper.getModel('commodity');
        if(!req.session.user){
            req.session.error = "Operation timed out: Please log in again"
            res.redirect('/login');
        }else{
//         	console.log("about to insert comment to database");
            Commodity.update({"name":req.body.commodityName},
            	{"$push": {"comments": {"content": req.body.content, "uId":req.body.uId}
            				}
            	}
             	,function (error, docs) {
             		if(docs) {
            			res.send(200);	 
            		}
 
             	}
            );
        }
        
	});
    
}
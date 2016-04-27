module.exports = function ( app ) {
//     app.get('/myAccount', function(req, res) {
//         var User = global.dbHelper.getModel('user');
//         if(!req.session.user){
//             req.session.error = "Operation timed out: Please log in again"
//             res.redirect('/login');
//         }else{
//             User.find({"_id":req.session.user._id}, function (error, docs) {
//                 res.render('myAccount.html',{user:docs});
//             });
//         }
//     });
    
    
    app.get('/myAccount/addressBook', function(req, res) {
        var User = global.dbHelper.getModel('user');
        if(!req.session.user){
            req.session.error = "Operation timed out: Please log in again"
            res.redirect('/login');
        }else{
            User.findById(req.session.user._id, function (error, docs) {
                 res.render('addressBook.html',{user:docs});
            });
        }
    });
    
    
    app.post('/myAccount/addressBook/addAddress', function (req, res) {
        var User = global.dbHelper.getModel('user');
        if(!req.session.user){
            req.session.error = "Operation timed out: Please log in again"
            res.redirect('/login');
        }else{
			User.update({"_id": req.session.user._id},
				{"$push": {"addressBook": {
									"addressName": req.body.addressName,
                 					"address": req.body.address,
                 					"zipcode": req.body.zipcode,
                 					"recipient": req.body.recipient,
                 					"phoneNumber": req.body.phoneNumber
                 					}
                 			  }
            	}, function(error, doc) {
            			if (doc) {
            			    res.send(200);
           				}else{
                			res.send(404);
            			}
            	});
		}
    });
    
    

    app.post('/myAccount/addressBook/modifyAddress', function (req, res) {
        var User = global.dbHelper.getModel('user');
        if(!req.session.user){
            req.session.error = "Operation timed out: Please log in again"
            res.redirect('/login');
        }else{
			User.update({"_id": req.session.user._id, "addressBook.addressName": req.body.addressName},
				{"$pull": 
					{"addressBook": {"addressName":req.body.addressName} }
            	}
             	, function(error, doc) {
             			if (doc) {
             			console.log('pulled old address out');
			User.update({"_id": req.session.user._id},
				{"$push": {"addressBook": {
									"addressName": req.body.addressName,
                 					"address": req.body.address,
                 					"zipcode": req.body.zipcode,
                 					"recipient": req.body.recipient,
                 					"phoneNumber": req.body.phoneNumber
                 					}
                 			  }
            	}, function(error, doc) {
            			if (doc) {
            			console.log('pushed new address into database');
            			    res.send(200);
           				}else{
                			res.send(404);
            			}
            	});
            				}else{
//                  			res.send(404);
             			}
             	}
            	);

		}
    });

    
    
    app.post('/myAccount/addressBook/deleteAddress', function (req, res) {
        var User = global.dbHelper.getModel('user');
        if(!req.session.user){
            req.session.error = "Operation timed out: Please log in again"
            res.redirect('/login');
        }else{
			User.update({"_id": req.session.user._id, "addressBook.addressName": req.body.addressName},
				{"$pull": 
					{"addressBook": {"addressName":req.body.addressName} }
            	}, function(error, doc) {
            			if (doc) {
            			    res.send(200);
           				}else{
                			res.send(404);
            			}
            	});
		}
    });
    
    

    app.get('/myAccount/orderHistory', function(req, res) {
        var User = global.dbHelper.getModel('user');
        var Order = global.dbHelper.getModel('order');
        if(!req.session.user){
            req.session.error = "Operation timed out: Please log in again"
            res.redirect('/login');
        }else{
            Order.find({"uId":req.session.user._id}, function (error, docs) {
                res.render('orderHistory.html',{orders:docs});
            });
        }
    });
    
    
    
    app.get('/myAccount/orderHistory/:orderId', function(req, res) {
        var User = global.dbHelper.getModel('user');
        var Order = global.dbHelper.getModel('order');
        if(!req.session.user){
            req.session.error = "Operation timed out: Please log in again"
            res.redirect('/login');
        }else{
            Order.find({"orderId":req.params.orderId}, function (error, docs) {
                res.render('orderDetail.html',{order:docs});
            });
        }
    });

    


}
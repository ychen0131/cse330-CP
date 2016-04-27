module.exports = function ( app ) {
    //查看购物车商品
    app.get('/cart', function(req, res) {
    	var User = global.dbHelper.getModel('user');
        var Cart = global.dbHelper.getModel('cart');
        var addressBook = [];
        if(!req.session.user){
            req.session.error = "Operation timed out: Please log in again"
            res.redirect('/login');
        }else{
        	User.findById(req.session.user._id, function(error, docs){
        		for (var i in docs.addressBook) {
        			addressBook.push(docs.addressBook[i]);
        		}
        	});
            Cart.find({"uId":req.session.user._id,"cStatus":false}, function (error, docs) {
                res.render('cart',{addressBook:addressBook, uId: req.session.user._id, carts:docs});
            });
        }
    });
    //添加购物车商品
    app.get("/addToCart/:id", function(req, res) {
       //req.params.id 获取商品ID号
        if(!req.session.user){
            req.session.error = "Operation timed out: Please log in again"
            res.redirect('/login');
        }else{
            var Commodity = global.dbHelper.getModel('commodity'),
                Cart = global.dbHelper.getModel('cart');
            Cart.findOne({"uId":req.session.user._id, "cId":req.params.id},function(error,doc){
                //商品已存在 +1
                if(doc){
                    Cart.update({"uId":req.session.user._id, "cId":req.params.id},{$set : { cQuantity : doc.cQuantity + 1 }},function(error,doc){
                        //成功返回1  失败返回0
                        if(doc > 0){
                            res.redirect('/home');
                        }
                    });
                //商品未存在，添加
                }else{
                    Commodity.findOne({"_id": req.params.id}, function (error, doc) {
                        if (doc) {
                            Cart.create({
                                uId: req.session.user._id,
                                cId: req.params.id,
                                cName: doc.name,
                                cPrice: doc.price,
                                cImgSrc: doc.imgSrc,
                                cQuantity : 1
                            },function(error,doc){
                                if(doc){
                                    res.redirect('/home');
                                }
                            });
                        } else {

                        }
                    });
                }
            });
        }
    });

    //删除购物车商品
    app.get("/delFromCart/:id", function(req, res) {
        //req.params.id 获取商品ID号
        var Cart = global.dbHelper.getModel('cart');
        Cart.remove({"_id":req.params.id},function(error,doc){
            //成功返回1  失败返回0
            if(doc > 0){
                res.redirect('/cart');
            }
        });
    });


 	var tempOrderId;


    app.post("/cart/createOrder", function(req, res) {
        //req.params.id 获取商品ID号
        console.log(req.body.addressName);
        var timestamp = new Date().getUTCMilliseconds();
        var now = new Date();
		timestamp = now.getFullYear().toString(); // 2011
		timestamp += (now.getMonth() < 9 ? '0' : '') + now.getMonth().toString(); // JS months are 0-based, so +1 and pad with 0's
		timestamp += (now.getDate() < 10 ? '0' : '') + now.getDate().toString(); // pad with a 0
		timestamp += (now.getHours() < 10 ? '0' : '') + now.getHours().toString(); // pad with a 0
		timestamp += (now.getMinutes() < 10 ? '0' : '') + now.getMinutes().toString(); // pad with a 0
		timestamp += (now.getSeconds() < 10 ? '0' : '') + now.getSeconds().toString(); // pad with a 0
		timestamp += (now.getMilliseconds() < 10 ? '0' : '') + now.getMilliseconds().toString(); // pad with a 0
		
 		tempOrderId=timestamp;
		
        var Order = global.dbHelper.getModel('order');
// 		Order.insert({"uId":req.body.uId, "orderId":timestamp},function(error, doc){
// 			if (doc){
// 				res.send(200);
// 			} else {
// 				res.send(404);
// 			}
// 		});
// 		
        Order.create({
            uId: req.body.uId,
            orderId: timestamp,
            oAddress: req.body.addressName
        }, function (error, doc) {
            if (error) {
                res.send(500);
                console.log(error);
            } else {
                req.session.error = 'order created';
                res.send(200);
            }
        });

		
		
		
    });


    //购物车结算
    app.post("/cart/clearing",function(req,res){
        var Cart = global.dbHelper.getModel('cart');
        var User = global.dbHelper.getModel('user');
        
        		
        	var Commodity=global.dbHelper.getModel('commodity');
        	Commodity.findById(req.body.cid, function(error, docs){
        		var Order = global.dbHelper.getModel('order');
        		Order.update({"orderId":tempOrderId},
        			{"$push": {"oQuantities": {"productAmt":req.body.cnum}}
        			}, function(error, doc) {
            			if (doc) {
             			    res.send(200);
           				}else{
                			req.session.error = 'cannot add quantity';
                 			res.send(404);
            			}
            	});
        		Order.update({"orderId":tempOrderId},
        			{"$push": {"oCommodities": {"productId": req.body.cid}
//         						{
//         						"name": docs.name,
//         						"price": docs.price,
//         						"imgSrc": docs.imgSrc
//         						}
        					  }
        			}, function(error, doc) {
            			if (doc) {
             			    res.send(200);
           				}else{
                			req.session.error = 'cannot add product';
                 			res.send(404);
            			}
            	});
        	});

			console.log("About to remove "+req.body.cid);
        	Cart.remove({"cId":req.body.cid}
        	 , function(error, doc) {
         		if(doc>0) {
 					console.log("Successfully removed "+req.body.cid);
 
         			res.send(200);
         		} else {
         			console.log(error);
         			res.send(404);
         		}
         	}
        	);
        	
    });


}


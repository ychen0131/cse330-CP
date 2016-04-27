var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    models = require('./models');

var address= new Schema({
	addressName: String,
    address: String,
    zipcode: String,
    recipient: String,
    phoneNumber: String
});

var commodity = new Schema({
	name: String,
	price: Number,
	imgSrc: String
});


var order = new Schema({
    uId: { type: String },
	orderId: Number,
	oQuantities: [],
    oCommodities: [],
    oAddress: String
//     oAddress: {
//         type: Schema.ObjectId,
//         ref: 'address'
//     }
});

module.exports = {
// 	address: {
//     	address: String,
//     	zipcode: String,
//     	recipient: String,
//     	phoneNumber: String
// 	},
    user: {
        name: { type: String, required: true },
        password: { type: String, required: true },
        addressBook: [address],
    },
    commodity: {
        name: String,
        price: Number,
        imgSrc: String,
        description : String,
        comments: []
    },
    cart:{
        uId: { type: String },
        cId: { type: String },
        cName: { type: String },
        cPrice: { type: String },
        cImgSrc: { type:String } ,
        cQuantity: { type: Number },
        cStatus : { type: Boolean, default: false }
    },
    order: {
        uId: { type: String },
    	orderId: Number,
        oQuantities: [],
    	oCommodities: [],
    	oAddress: String
//     	oAddress: {
//         	type: Schema.ObjectId,
//         	ref: 'address'
//     	}

    }
};

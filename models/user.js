const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

//Define our model
const userSchema = new Schema({
	username: {type:String, unique: true, dropDups: true},
	email: { type: String, unique: true, lowercase: true, dropDups: true },
	password: String,
	image: String,
	country_from: String,
	country_in: {
		country: String,
		city: String
	},
	posts: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: "Post"
    }],
    comments: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
    }],
    notifications: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: "Notification"
    }]
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err) { console.log(err);return callback(err) }
		callback(null, isMatch);
	});
}

//create the model class
const ModelClass = mongoose.model('user', userSchema);

//export the model
module.exports = ModelClass;
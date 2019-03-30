const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ContactSchema = new Schema({
    name: {type: String, required: true, max: 100},
	orgname: {type: String },
	email:{type:String,required:true},
	mobile:{type:String},
	category:{type:String,required:true},
    date: {type: Date, default: Date.now}
});


// Export the model
module.exports = mongoose.model('cDetails', ContactSchema);
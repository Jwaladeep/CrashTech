const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ContactSchema = new Schema({
    name: {type: String, required: true, max: 100},
	orgname: {type: String },
	email:{type:String,required:true},
	phone:{type:String},
	city:{type:String},
	registerfor:{type:String,required:true},
    appdate: {type: Date, default: Date.now}
});


// Export the model
module.exports = mongoose.model('cDetails', ContactSchema);
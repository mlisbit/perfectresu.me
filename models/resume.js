var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ResumeSchema = new Schema({
    file_name: {type: String, unique: true},
    comments: [String],
    views: Number,
    tags: [String],
    ratings: {
    	asthetics: {
    		count: {type: Number, default: 0},
    		sum: {type: Number, default: 0}
    	},
    	content: {
    		count: {type: Number, default: 0},
    		sum: {type: Number, default: 0}
    	},
    	grammer: {
    		count: {type: Number, default: 0},
    		sum: {type: Number, default: 0}
    	}
    }
});

var UserSchema = new Schema({
    name: String
});

Resume = mongoose.model('Resume', ResumeSchema);

exports.Resume = Resume;

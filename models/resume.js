var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ResumeSchema = new Schema({
    file_name: {type: String, unique: true},
    comments: [String],
    views: Number,
    tags: [String],
    ratings: {
    	asthetics: {
    		count: [Number],
    		sum: [Number]
    	},
    	content: {
    		count: [Number],
    		sum: [Number]
    	},
    	grammer: {
    		count: [Number],
    		sum: [Number]
    	}
    }
});

var UserSchema = new Schema({
    name: String
});

Resume = mongoose.model('Resume', ResumeSchema);

exports.Resume = Resume;

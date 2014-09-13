var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ResumeSchema = new Schema({
    file_location: String,
    rating: Number,
    comments: [String],
    views: Number,
    tags: [String]
});

var UserSchema = new Schema({
    name: String
});

Resume = mongoose.model('Resume', ResumeSchema);

exports.Resume = Resume;

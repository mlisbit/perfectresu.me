var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ResumeSchema = new Schema({
    file_name: {type: String, unique: true},
    rating_sum: Number,
    rating_count: Number,
    comments: [String],
    views: Number,
    tags: [String]
});

var UserSchema = new Schema({
    name: String
});

Resume = mongoose.model('Resume', ResumeSchema);

exports.Resume = Resume;

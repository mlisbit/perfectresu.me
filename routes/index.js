var resume_model = require('../models/resume.js');

var Resume = resume_model.Resume;

//GET
exports.index = function(req, res, next){
	res.render("index.html")
};

//GET
exports.upload_get = function(req, res, next){
	res.render("upload.html")
};

//POST
exports.upload_post = function(req, res, next){
	console.log(req.body)
	var instance = new Resume(req.body);
	
	instance.save(function(err) {
		if (err) {
			next(err);
		}
		res.render('upload.html')
	});
};

//GET
exports.list = function(req, res, next){
	
};
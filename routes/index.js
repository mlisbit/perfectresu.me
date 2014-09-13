var resume_model = require('../models/resume.js');
var fs = require('fs');
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
	var instance = new Resume(req.body);
	
	fs.readFile(req.files.file.path, function (err, data) {
		fs.rename(req.files.file.path, __dirname + '/../public/uploads/' + req.files.file.path.split('/')[req.files.file.path.split('/').length-1], function(err) {
			if (err) {
				console.log(err);
			}
		})
	});

	instance.save(function(err) {
		if (err) {
			next(err);
		}
		res.render('upload.html')
	});
};

//GET
exports.list = function(req, res, next){
	Resume.find({},function (err, docs) {
        res.send(docs);
    });
};

//GET
exports.clear = function(req, res, next){
	Resume.remove(function(err) {
		if (err) {
			next({err: err})
		}
		res.send("removed database successfully.")	
	});

};

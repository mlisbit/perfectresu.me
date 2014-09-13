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
	instance.file_name = req.files.file.path.split('/')[req.files.file.path.split('/').length-1]

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

//PUT
exports.upload_put = function(req, res, next) {
	inc_fields = {
		rating_count: 1,
		rating_sum: req.body.rating
	};

	add_fields = {
		comments: req.body.comment
	};

	Resume.update({file_name: req.body.file}, {$inc: inc_fields, $addToSet: add_fields}, 
		function(err) {
			if (err) { 
				console.log(err);
				res.send(err);
			} else {
				res.send("whats done is done.")
			}	
		});
}

//GET
exports.list = function(req, res, next){
	Resume.find({},function (err, docs) {
        res.send(docs);
    });
};

//GET
exports.browse = function(req, res, next){
	var q = req.query
	var tags = []
	var args = {}
	if (q['tags']) {
		tags = q['tags'].split(',')	
		args['tags'] = tags
	}

	Resume.count(args, function(err, count) {
		Resume
		.findOne(args)
		.skip(req.params.current)
		.exec(function (err, doc) {
			if (doc) {
				res.render('browse', {
	  				resume: doc,
	  				count: count,
	  				search_tags: tags
	  			});	
			} else {
				res.render('browse', {
					count: 0,
					search_tags: tags,
	  				warning: "Sorry, but there are no results for your current query."
	  			});	
			}
	    });
	})
	
}

//GET
exports.clear = function(req, res, next){
	Resume.remove(function(err) {
		if (err) {
			next({err: err})
		}
		res.send("removed database successfully.")	
	});
};

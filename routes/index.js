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
		'ratings.asthetics.count': 1,
		'ratings.asthetics.sum': parseFloat(req.body.asthetics_rating),
		'ratings.content.count': 1,
		'ratings.content.sum': parseFloat(req.body.content_rating),
		'ratings.grammer.count': 1,
		'ratings.grammer.sum': parseFloat(req.body.grammer_rating),
	};

	add_fields = {
		comments: req.body.comment
	};

	console.log(req.body.asthetics_rating);

	if (!req.body.comment) {delete add_fields.comments};
	if (!req.body.asthetics_rating) {
		delete inc_fields['ratings.asthetics.count'];
		delete inc_fields['ratings.asthetics.sum']
	};
	if (!req.body.content_rating) {
		delete inc_fields['ratings.content.count'];
		delete inc_fields['ratings.content.sum']
	};
	if (!req.body.grammer_rating) {
		delete inc_fields['ratings.grammer.count'];
		delete inc_fields['ratings.grammer.sum']
	};

	Resume.update({file_name: req.body.file}, {$inc: inc_fields	, $addToSet: add_fields}, 
		function(err) {
			if (err) { 
				console.log(err);
				res.send(err);
			} else {
				res.render('index.html')
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

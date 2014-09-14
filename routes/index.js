var resume_model = require('../models/resume.js');
var fs = require('fs');
var Resume = resume_model.Resume;
var _ = require('underscore');

//GET
exports.index = function(req, res, next){
	Resume.count({}, function(err, count) {
		res.render("index.html", {count: count})
	})	
};

//GET
exports.upload_get = function(req, res, next){
	res.render("upload.html")
};

//GET
exports.tags = function(req, res, next) {
	Resume.find({}, {_id: 0, tags: 1},function (err, docs) {
		var all_tags = []
		//horribly inefficient, i know
        for (doc_index in docs) {
        	var tag_array = docs[doc_index].tags
        	all_tags.push(tag_array) 
        }
        res.send(_.uniq(_.flatten(all_tags)))
    });
}

//POST
exports.upload_post = function(req, res, next){
	var instance = new Resume(req.body);
	instance.file_name = req.files.file.path.split('/')[req.files.file.path.split('/').length-1]
	instance.tags = req.body.tags.toLowerCase().replace(' ', '').split(',');
	console.log(instance.tags)

	fs.readFile(req.files.file.path, function (err, data) {
		fs.rename(req.files.file.path, __dirname + '/../public/uploads/' + req.files.file.path.split('/')[req.files.file.path.split('/').length-1], function(err) {
			if (err) {
				console.log(err);
			}
		})
	});

	instance.save(function(err) {
		if (err) {
			res.send(err);
		}
		res.redirect(req.get('referer'))
	});
};

//PUT
exports.upload_put = function(req, res, next) {
	var is_ajax_request = req.xhr;
	inc_fields = {
		'ratings.aesthetics.count': 1,
		'ratings.aesthetics.sum': parseFloat(req.body.aesthetic_rating),
		'ratings.content.count': 1,
		'ratings.content.sum': parseFloat(req.body.content_rating),
		'ratings.grammar.count': 1,
		'ratings.grammar.sum': parseFloat(req.body.grammar_rating),
	};

	add_fields = {
		comments: req.body.comment
	};

	console.log(req.body.aesthetic_rating);

	if (!req.body.comment) {delete add_fields.comments};
	if (!req.body.aesthetic_rating) {
		delete inc_fields['ratings.aesthetics.count'];
		delete inc_fields['ratings.aesthetics.sum']
	};
	if (!req.body.content_rating) {
		delete inc_fields['ratings.content.count'];
		delete inc_fields['ratings.content.sum']
	};
	if (!req.body.grammar_rating) {
		delete inc_fields['ratings.grammar.count'];
		delete inc_fields['ratings.grammar.sum']
	};

	Resume.update({file_name: req.body.file}, {$inc: inc_fields	, $addToSet: add_fields}, 
		function(err) {
			if (err) { 
				console.log(err);
				res.send(err);
			} else {
				if (is_ajax_request) {
					res.send('success!')
				} else {
					res.redirect(req.get('referer'));
				}
				
			}
		});
}

//GET
exports.list = function(req, res, next){
	Resume.find({},function (err, docs) {
        res.render('list', {
        	resumes: docs
        });
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

	var and_tag_args = function() {
		
		if (args['tags']) {
			var query = {$and: []}
			for (var i = 0 ; i < args['tags'].length ; i++) {
				query['$and'].push({'tags':  args['tags'][i]})
			}
		} else {
			var query = {}
		}
		
		//{$and: [{'tags': 'pickle'}, {'tags': 'it'}]}
		return query
	};

	Resume.count(args, function(err, count) {
		Resume
		.findOne(and_tag_args())
		.sort({date: 1})
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

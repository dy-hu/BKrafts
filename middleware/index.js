//all the middleware goes here
var middlewareObj = {};
var Custom = require("../models/customs");
var Comment = require("../models/comment");

middlewareObj.checkCustomOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {
		Custom.findById(req.params.id, function(err, foundCustom) {
			if(err){
				req.flash("error", "Custom not found");
				res.redirect("back");
			} else {
				if(foundCustom.author.id.equals(req.user._id) || req.user.isAdmin) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if(err || !foundComment){
				req.flash("error", "Comment not found");
				res.redirect("back");
			} else {
				if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req,res,next) {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that!");
	res.redirect("/login");
}


module.exports = middlewareObj;
var express = require("express");
var router = express.Router({mergeParams:true});
var Custom = require("../models/customs");
var Comment = require("../models/comment");
var middleware = require("../middleware");
//=========================
//COMMENTS ROUTE
//=========================

//comments new
router.get("/new", middleware.isLoggedIn, function(req, res) {
	Custom.findById(req.params.id, function(err, custom) {
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {custom:custom});
		}
	});
});

//comments create
router.post("/", middleware.isLoggedIn, function(req, res) {
	Custom.findById(req.params.id, function(err, custom) {
		if(err){
			console.log(err);
			res.redirect("/customs");
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if(err) {
					req.flash("error", "Something went wrong");
					console.log(err);
				} else {
					//add username & id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					custom.comments.push(comment);
					custom.save();
					req.flash("success", "Successfully Added Comment");
					res.redirect("/customs/" + custom._id);
				}
			});
		}
	});
});

//edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
	Custom.findById(req.params.id, function(err, foundCustom) {
		if(err || !foundCustom) {
			req.flash("error", "No Custom found");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, function(err, foundComment) {
		if(err) {
			res.redirect("back");
		} else {
			res.render("comments/edit", {custom_id: req.params.id, comment:foundComment});
		}
		});
	});
});

//update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if(err) {
			res.redirect("back");
		} else {
			res.redirect("/customs/" + req.params.id);
		}
	});
});

//destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if(err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/customs/" + req.params.id);
		}
	});
});

//middleware



module.exports = router;
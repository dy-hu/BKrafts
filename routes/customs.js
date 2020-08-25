var express = require("express");
var router = express.Router();
var Custom = require("../models/customs");
var middleware = require("../middleware");
//INDEX ROUTE
router.get("/", function(req, res) {
	 
	//Get all customs from DB
	Custom.find({}, function(err, allcustoms) {
		if(err) {
			console.log(err);
		} else {
			res.render("customs/index", {customs:allcustoms, currentUser: req.user});
		}
	})
});

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res) {
	//get data from form & add to customs array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCustom = {name:name, image:image, description:desc, author:author, price:price};
	//Create a new custom and save to DB
	Custom.create(newCustom, function(err, newlyCreated) {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/customs");
		}
	})
	//redirect back to customs page
});

//NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("customs/new");	
});

//SHOW
router.get("/:id", function(req, res) {	Custom.findById(req.params.id).populate("comments").exec(function(err, foundCustom) {
		if(err || !foundCustom) {
			req.flash("error", "Custom not found");
			res.redirect("back")
		} else {
			res.render("customs/show", {custom: foundCustom});
		}
	});
});

//EDIT 
router.get("/:id/edit", middleware.checkCustomOwnership, function(req,res) {
		Custom.findById(req.params.id, function(err, foundCustom) {
			if(err) {
				console.log(err);
			}
			res.render("customs/edit", {custom: foundCustom});
		});
});

//UPDATE
router.put("/:id", middleware.checkCustomOwnership, function(req, res) {
	Custom.findByIdAndUpdate(req.params.id, req.body.custom, function(err, updatedCustom) {
		if(err){
			res.redirect("/customs");
		} else {
			res.redirect("/customs/" + req.params.id);
		}
	})
});

//DESTROY
router.delete("/:id", middleware.checkCustomOwnership, function(req,res) {
	Custom.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			res.redirect("/customs");
		} else {
			res.redirect("/customs");
		}
	})
});

//middleware




module.exports = router;
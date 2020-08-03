var express 		= require("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	flash 			= require("connect-flash"),
	passport 		= require("passport"),
	LocalStrategy 	= require("passport-local"),
	methodOverride  = require("method-override"),
	Campground 		= require("./models/campground"),
	seedDB 			= require("./seeds"),
	User 			= require("./models/user"),
	Comment 		= require("./models/comment")

const mongoose = require("mongoose");

//requiring routes
var commentRoutes 	 = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes 		 = require("./routes/index")
	
// seedDB();
mongoose.connect("mongodb+srv://daniel:shirrenwang@cluster0.4x4ur.mongodb.net/yelp_camp?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

//PASSPORT CONFIG
app.use(flash());
app.use(require("express-session")({
	secret: "I'm fat",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(3000, function() {
	console.log("Server listening on port 3000");
});
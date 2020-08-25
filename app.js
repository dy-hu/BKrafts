var express 		= require("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	flash 			= require("connect-flash"),
	passport 		= require("passport"),
	LocalStrategy 	= require("passport-local"),
	methodOverride  = require("method-override"),
	Custom 			= require("./models/customs"),
	seedDB 			= require("./seeds"),
	User 			= require("./models/user"),
	Comment 		= require("./models/comment")

const mongoose = require("mongoose");

//requiring routes
var commentRoutes 	 = require("./routes/comments"),
	customRoutes = require("./routes/customs"),
	indexRoutes 		 = require("./routes/index")
	
// seedDB();
mongoose.connect("mongodb://localhost:27017/BKrafts", {
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
app.use("/customs/:id/comments", commentRoutes);
app.use("/customs", customRoutes);

app.locals.moment = require("moment");

app.listen(3000, function() {
	console.log("Server listening on port 3000");
});
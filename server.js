/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/
var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Create Database Connection
var pgp = require('pg-promise')();

/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.  We'll be using localhost and run our database on our local machine (i.e. can't be access via the Internet)
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab, we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database.  You'll need to set a password USING THE PSQL TERMINAL THIS IS NOT A PASSWORD FOR POSTGRES USER ACCOUNT IN LINUX!
**********************/
//uncomment when deploying
//const dbConfig = process.env.DATABASE_URL;

const dbConfig = {
	host: 'ec2-50-19-109-120.compute-1.amazonaws.com',
	port: 5432,
	database: 'd7i76p9do8qnha',
	user: 'ggoqkekkefjkub',
	password: '151614019057fb208ab3ed5fed64297891e890f500d44a661591b74f8308731e',
  ssl: true
};

var db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory



/*********************************
 Below we'll add the get & post requests which will handle:
   - Database access
   - Parse parameters from get (URL) and post (data package)
   - Render Views - This will decide where the user will go after the get/post request has been processed

  		/team_stats - get request (no parameters)
  			This route will require no parameters.  It will require 3 postgres queries which will:
  				1. Retrieve all of the football games in the Fall 2018 Season
  				2. Count the number of winning games in the Fall 2018 Season
  				3. Count the number of lossing games in the Fall 2018 Season
  			The three query results will then be passed on to the team_stats view (pages/team_stats).
  			The team_stats view will display all fo the football games for the season, show who won each game,
  			and show the total number of wins/losses for the season.

************************************/
var express = require('express');
var parser = require('body-parser');
var path = require('path');
var app = express();
app.use(parser.urlencoded({extended:false}))
app.use(parser.json())

app.use(function(req,res,next){
  res.locals.userValue = null;
  next();
})

app.set('view engine', 'ejs');
//app.set('views',path.join(__dirname,'appviews'))
// login page
app.get('/', function(req, res) {
  var user_query = 'select * from users;';


  db.task('get-everything', task => {
        return task.batch([
            task.any(user_query),
        ]);
    })
    .then(data => {
      console.log(data[0]),
      res.render('pages/Login',{
        my_title: "Login Page",
        user_data: data[0],
      })
    })
    .catch(error => {
        // display error message in case an error
          console.log("ERROR: " + error);
    });

});
// registration page
app.get('/register', function(req, res) {
	res.render('pages/Registration',{
		my_title:"Registration Page"
	});
});

// weather page
app.get('/weather', function(req, res) {
	var weather_query = 'select * from weatherdata3;';


  db.task('get-everything', task => {
        return task.batch([
            task.any(weather_query),
        ]);
    })
    .then(data => {
      console.log(data[0]),
    	res.render('pages/ProjWebsite',{
				my_title: "Weather Page",
				weather_data: data[0],
			})
    })
    .catch(error => {
        // display error message in case an error
          console.log("ERROR: " + error);
    });

});
app.post('member/add', function(req,res){
  var member = {
    first : req.body.fname,
    last:req.body.lname,
    username : req.body.username,
    password : req.body.password
  }
  console.log(member);
  res.render('pages/AdminLogin',{
    userValue : member,
    my_title : "Login Page"
  });
})

//app.listen(process.env.PORT);
app.listen(3000);

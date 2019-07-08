// For web scraping
var axios = require('axios');
// To use jQuery methods in Node
var cheerio = require('cheerio');
// To use mongoose ORM
var mongoose = require('mongoose');

// To use express
var express = require('express');
var app = express();
// Lets express process url syntax
app.use(express.urlencoded({ extended: true }));
// Converts objects to JSON whether it is coming in or out to the server
app.use(express.json());
// Allows us to access static files if we need it
app.use(express.static("views"));  // you might not need this
app.use(express.static("public")); // you might not need this

// The port that it will be deployed on heroku servers or our own server
const PORT = process.env.PORT || 8000;

// URI is a format that helps us define connections to mongo databases
// we need two options, one for mLab and one for local testing
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/quizletwebscraper";
var db = require("./models");
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, autoIndex: false }); // if you don't set autoIndex to false, it can slow down your deployed app

// var card = { frontSide: "What is the capitol of the USA?", backSide: "DC" };

// db.Flashcard.create(card)
// .then(function(dbcard) {
//     console.log(dbcard);
// })
// .catch(function(err) {
//     console.log(err);
// });

// For handlebars
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


app.get('/', function (req, res) {

    axios.get("https://quizlet.com/369310355/mgt-112-quiz-2-flash-cards/").then(function (response) {
        const $ = cheerio.load(response.data);

        let results = [];

        $(".SetPageTerms-termsList .SetPageTerms-term .SetPageTerm-content").each(function (i, element) {
            let frontSide = $(element).find('.SetPageTerm-wordText').text();

            let backSide = $(element).find('.SetPageTerm-definitionText').text();

            results.push({
                id: i,
                frontSide: frontSide,
                backSide: backSide
            });
        });
        res.render('index',{results:results});
    });
});

app.post('/scrape', (req,res) => {
    console.log('scrape scrape');
    console.log(req.body.queryURL);
});


app.get('/cards/:id', function (req, res) {

});

app.listen(PORT, function () {
    console.log('Listening on http://localhost:' + PORT);
});
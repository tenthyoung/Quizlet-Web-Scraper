// For webscraping
var axios = require('axios');
var cheerio = require('cheerio');

// Connect to express
var express = require('express');
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const PORT = process.env.PORT || 8080;

// Database
// var mongoose = require("mongoose");
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/thetechiepostdb";
// mongoose.connect(MONGODB_URI);

// Requiring all moxdels
var db = require("./models");

// For handlebars
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


app.get('/', function (req, res) {
    console.log("\n***********************************\n" +
        "Grabbing every thread name and link\n" +
        "from reddit's webdev board:" +
        "\n***********************************\n");
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

app.listen(PORT, function () {
    console.log('Listening on http://localhost:' + PORT);
});
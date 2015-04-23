
var express = require('express');
var app = express();
var fs = require('fs');	

// var mongoose = require('mongoose');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

var server = new Server('localhost', 27017, { auto_reconnect: true });
db = new Db('tweets', server);

// server route handler
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
})
// serving static files 
app.use(express.static(__dirname));

// start server
var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Tweets app listening at http://%s:%s', host, port);
})

// read twitter stream using twitter api
var Twitter = require('twitter');

 // get authentification of twitter api
var client = new Twitter({
  consumer_key: 'sb0La6yeQZDyDGlce9cdDIRkW',
  consumer_secret: 'uhL4cF67INFM9ZHoHtOIJawu6agbUZ5WIakLx6WESvZo5r3qXP',
  access_token_key: '418655195-by0ACfzze59BXrJe2YaLpBSq6HkqHGovjWYr8n0Z',
  access_token_secret: 'OZbUuM4YrqoSehNSGkQnP7cDMiSTg4YxMDeVVbUuvlrSi'
});


fs.writeFile('filter-tweets.json', '[', function (err) {
  if (err) throw err;
  console.log('file created!');
});


// Using twitter api, get status's with the filter searching for 'twitter'. Limited stream to 100 tweets (for time reasons)
var count = 0;
var max = 100;
client.stream('statuses/filter', {track: 'twitter'},  function(stream){
  stream.on('data', function(tweet) {
  	if(count < max){
  		// Appends the tweet data
  		fs.appendFile('filter-tweets.json', JSON.stringify(tweet,null,4) +",", function(err) {
        if (err) throw err;
		  });
		  count++;
  	} else { 
  		// Last tweet so close the json file
  		fs.appendFile('filter-tweets.json', JSON.stringify(tweet,null,4)+']', function (err) {
		  if (err) throw err;
		  console.log('Closed file and stream');
      
		});
  		stream.destroy();
  	}
  });

  stream.on('error', function(error) {
    console.log(error);
  });

  stream.on('end', function(){
	 console.log("finished getting data");
  });

});

var createDB = function() {
  console.log("Building database");
  db.open(function (err, db) {
    if (!err) {
      console.log("Connecting to tweets database");
      db.collection('tweets', { strict: true }, function (err, collection) {
        // Removes old data from the database
        collection.remove({}, function(err, result){});

        fs.readFile("filter-tweets.json", function(err,data){

          var tweets = JSON.parse(data);
          for (var i = 0; i < (tweets.length -1); i++) {
            if(tweets[i]['limit'] == undefined){
              var tmp = [{
                "created_at": tweets[i]['created_at'],
                "id": tweets[i]['id'],
                "text": tweets[i]['text'],
                "user_id": tweets[i]['user']['id'],
                "user_name": tweets[i]['user']['name'],
                "user_screen_name": tweets[i]['user']['screen_name'],
                "user_location": tweets[i]['user']['location'],
                "user_followers_count": tweets[i]['user']['followers_count'],
                "user_friends_count": tweets[i]['user']['friends_count'],
                "user_created_at": tweets[i]['user']['created_at'],
                "user_time_zone": tweets[i]['user']['time_zone'],
                "user_profile_background_color": tweets[i]['user']['profile_background_color'],
                "user_profile_image_url": tweets[i]['user']['profile_image_url'],
                "geo": tweets[i]['geo'],
                "coordinates": tweets[i]['coordinates'],
                "place": tweets[i]['place']
              }];

              collection.insert(tmp, { safe: true }, function (err, result) { });
            }
          }
          console.log("Database created!");
        });

      });
    }
  });
}

app.post('/createDB', function(req, res){
  createDB();
});

app.post('/getTweets', function(req, res){
  db.open(function (err, db) {
    if (!err) {
      console.log("Connecting to tweets database");
      db.collection('tweets', { strict: true }, function (err, collection) {
        collection.find({}).toArray(function(err, result){
          res.send(result);
          console.log("Sent results to front ent");
        });

      });
    }
  });
});



var express = require('express');
var fs = require('fs');	
var bodyParser = require('body-parser');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var Twitter = require('twitter'); // read twitter stream using twitter api

var app = express();

var server = new Server('localhost', 27017, { auto_reconnect: true });
db = new Db('tweets', server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

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

var io = require('socket.io').listen(server);


// get authentification of twitter api
var client = new Twitter({
  consumer_key: 'sb0La6yeQZDyDGlce9cdDIRkW',
  consumer_secret: 'uhL4cF67INFM9ZHoHtOIJawu6agbUZ5WIakLx6WESvZo5r3qXP',
  access_token_key: '418655195-by0ACfzze59BXrJe2YaLpBSq6HkqHGovjWYr8n0Z',
  access_token_secret: 'OZbUuM4YrqoSehNSGkQnP7cDMiSTg4YxMDeVVbUuvlrSi'
});

// Makes sure the tweets collection is created
db.open(function (err, db) {
  if (!err) {
    db.createCollection("tweets", function(err, collection){
      if (err) throw err;
      console.log("Created tweets collection");
    });

  }
});

// Gets number of tweets in db
app.post("/checkDB", function(req, res){
  db.open(function (err, db) {
    if (!err) {
      console.log("Connecting to tweets database");
      db.collection('tweets', { strict: true }, function (err, collection) {
        collection.find({}).toArray(function(err, result){
          if(!err){
            res.send(result);
          }
          
        });

      });
    }
  });
});

// parses a tweet data and inserts it into the db
var addToDB = function(tweet) {
  db.open(function (err, db) {
    if (!err) {
      db.collection('tweets', { strict: true }, function (err, collection) {
        if(tweet['limit'] == undefined){
          var tmp = [{
            "created_at": tweet['created_at'],
            "id": tweet['id'],
            "text": tweet['text'],
            "user_id": tweet['user']['id'],
            "user_name": tweet['user']['name'],
            "user_screen_name": tweet['user']['screen_name'],
            "user_location": tweet['user']['location'],
            "user_followers_count": tweet['user']['followers_count'],
            "user_friends_count": tweet['user']['friends_count'],
            "user_created_at": tweet['user']['created_at'],
            "user_time_zone": tweet['user']['time_zone'],
            "user_profile_background_color": tweet['user']['profile_background_color'],
            "user_profile_image_url": tweet['user']['profile_image_url'],
            "geo": tweet['geo'],
            "coordinates": tweet['coordinates'],
            "place": tweet['place']
          }];

          collection.insert(tmp, { safe: true }, function (err, result) { });
        }
      });
    } else{
      return 0;
    }
  });
  return 1;
}

// Using twitter api, get status's with the filter searching for 'twitter'.
app.post("/initialize", function(req, res){
  var max = req.body.numTweets;
  var count = 0;

  client.stream('statuses/filter', {track: 'twitter'},  function(stream){
    stream.on('data', function(tweet) {
      if(count < max){
        if(addToDB(tweet)){
          count++;
        }
      } else { 
        res.send("Alert: "+count+" tweets saved to the database!");
        stream.destroy();
      }
    });

    stream.on('error', function(error) {
      console.log(error);
    });

    stream.on('end', function(){
      console.log("Closing tweets database");
    });

  });

});

// deletes old tweets and inserts new tweets into db
app.post("/refreshTweets", function(req, res){
  var max = req.body.numTweets;
  var count = 0;

  db.open(function (err, db) {
    if (!err) {
      db.collection('tweets', { strict: true }, function (err, collection) {
        collection.remove({}, function(err, result){});
      });
    } 
  });

  client.stream('statuses/filter', {track: 'twitter'},  function(stream){
    
    stream.on('data', function(tweet) {
      if(count < max){
        if(addToDB(tweet)){
          count++;
        }
      } else { 
        res.send("Alert: "+count+" tweets updated to the database! Please reload the page to see the changes.");
        stream.destroy();
      }
    });

    stream.on('error', function(error) {
      console.log(error);
    });

    stream.on('end', function(){
      console.log("Closing tweets database");
    });

  });
});

// adds more tweets to the db
app.post("/getMoreTweets", function(req, res){
  var max = req.body.numTweets;
  var count = 0;

  client.stream('statuses/filter', {track: 'twitter'},  function(stream){
    
    stream.on('data', function(tweet) {
      if(count < max){
        if(addToDB(tweet)){
          count++;
        }
      } else { 
        res.send("Alert: "+count+" tweets added to the database! Please reload the page to see the changes.");
        stream.destroy();
      }
    });

    stream.on('error', function(error) {
      console.log(error);
    });

    stream.on('end', function(){
      console.log("Closing tweets database");
    });

  });
});

// attempt at making a live stream
var twee = io.of('tweet');
io.on('connection', function(socket){

  var count = 0;
  client.stream('statuses/filter', {track: 'twitter'},  function(stream){
    stream.on('data', function(tweet) {
      socket.emit('tweet',tweet);
    });

    stream.on('error', function(error) {
      console.log(error);
    });

    stream.on('end', function(){
      console.log("Closing tweets database");
    });

  });
});


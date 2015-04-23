
var express = require('express');
var app = express();

var fs = require('fs');	

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


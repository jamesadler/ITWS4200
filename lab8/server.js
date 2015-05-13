
var express = require('express');
var bodyParser = require('body-parser');
var SparqlClient = require('sparql-client');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// server route handler
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

// serving static files 
app.use(express.static(__dirname));

// start server
var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Sparql app listening at http://%s:%s', host, port);
})

var endpoint = 'http://dbpedia.org/sparql';

app.post('/requestQuery', function(req, res){
  var query = req.body.q;
 
  var client = new SparqlClient(endpoint);
  client.query(query).execute(function(error, results){
    res.end(JSON.stringify(results['results']['bindings']));
  });

});
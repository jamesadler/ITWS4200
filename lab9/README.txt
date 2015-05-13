to run the tweet ticker:
	1. install node.js, express, twitter, fs, body-parser, socket.io, and mongodb
		a. express, twitter, fs, body-parser, socket.io, and mongodb are all included under the node_modules folder
	2. in terminal go to the root of the server and run: node server.js
		a. the server will then create the tweets db.
	3. in a browser go to - localhost:3000

When a user first uses the program, it will ask them to initialize the db (entering number of tweets to get). Once that is done they will be greeted with a new layout. The user can then convert the mongoDB to a csv or json file; refresh the tweets in the db; add more tweets to the db; or try out the live stream mode. I decided to try out Foundation for my responsive framework.

Issues:
	had a lot of trouble limiting the rate at which the stream was sending to the front-end. I could not get setInterval or setTimeout to work.

Sources:
	I used google quite a lot, forgot to save all the stackoverflow pages i visited.

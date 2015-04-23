to run the tweet ticker:
	1. install node.js, express, twitter, fs, and mongodb
		1. express, twitter, and fs are all included under the node_modules folder
	2. in terminal go to the root of the server and run: node server.js
		a. the server will then create the json file needed for the twitter feed
	3. in a browser go to - localhost:3000

The backend (server.js) is the same as lab 5 and 6, except it now handles exporting json file to a mongo db. Main.js has the same getTweets function but now handles retreiving from the mongo db and now has a convertMongo function which takes in a file name then converts the tweets mongo db  to a JSON file.

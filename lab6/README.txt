to run the tweet ticker:
	1. install node.js, express, twitter, and fs
		1. express, twitter, and fs are all included under the node_modules folder
	2. in terminal go to the root of the server and run: node server.js
		a. the server will then create the json file needed for the twitter feed
	3. in a browser go to - localhost:3000

The backend (server.js) is the same as lab 5. Main.js has the same getTweets function (fixed the issue where tweets wouldn't reset when a new number is entered) and now has a convertJSON function which takes in a file name then converts the filter-tweets.json file to a comma-delimited CSV file.


Credit:
http://stackoverflow.com/questions/13405129/javascript-create-and-save-file

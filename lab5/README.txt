to run the tweet ticker:
	1. install node.js, express, twitter, and fs
		1. express, twitter, and fs are all included under the node_modules folder
	2. in terminal go to the root of the server and run: node server.js
		a. the server will then create the json file needed for the twitter feed
	3. in a browser go to - localhost:3000



The back-end (server.js) uses express to display the twitter stream. Main.js gets the data from the json file, and depending on the number the user entered, will display that number of tweets.

Issues:
	had a lot of issues with getting the data from angular. Finally figured out that I had to manually make the json file (e.g append the brackets ([]) and the commas (,) between each tweet entry).

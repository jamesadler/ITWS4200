to run:
	1. install node.js, express, body-parser, and sparql-client
		a. express, body-parser, and sparql-client are all included under the node_modules folder
	2. in terminal go to the root of the server and run: node server.js
		a. there is no output on the server side; besides showing the listening port
	3. in a browser go to - localhost:3000

To start this lab, I used the base files from lab 7. Then removing the old index.html, I replaced it with the new layout required for this lab. The main.js file adds a sample sparql query to the query textarea; it also handles when the user presses "Request Query". When the server returns the query results, the front-end then parses the data (assuming the user is following the 3 column rule) and creates the header for the table - which will hold the results. The program then iterates through the results and adds the data to the table. If a result item is a link, the program makes the entry a clickable link.

The server.js file handles the sparql query. When it receives a query it sends the query to the endpoint and waits for a response; once it receives one it sends that response to the front-end for processing.

var angApp = angular.module('TwitterFeed', []);

angApp.controller("TwitterCtrl", function($scope, $http){
	$scope.tweets;

	$scope.TwitterPanel = function(){
		$.post("/checkDB", function(data){
			console.log(data.length);
			if(data.length > 0){
				$scope.numTweetsDB = data.length;

				$scope.tweets = data;
				$("#intro").remove();
				// console.log($scope.tweets);
				//If user wants more than 5 tweets, manually add first 5 then recursively add the rest.
	    		for(var i=0;i<5;i++) {
					$("#twitterFeed").append('<li class="tweet" id="tweet'+i+'"><img class="profile_pic" src="'+data[i].user_profile_image_url+'" onError="noProfile(this)"/>'+data[i].text+"</li>");
					$("#tweet"+i).append("<span class='author'>-- "+data[i].user_screen_name+"</span>");
				}
				if(data.length > 5){
	    			tweetTicker(data,4, data.length-1);
				}
				
				$(".mainProg").show();
			} else {
				$("#intro").show();
			}
		});
	};

	$scope.initialize = function() {
		// Sends the initial number of tweets to store
		$.post("/initialize", {numTweets: $scope.numberTweets}, function(data){
			if(data !== ""){
				$("#systemAlerts #alert").html(data);
				$("#systemAlerts").addClass("success");
				$("#systemAlerts").show();
				$("#intro").remove();
				$("#main").show();
				$(".mainProg").show();
				$scope.TwitterPanel();
			}
		});
	}
	
	$scope.convertCSV = function() {
		// Checks if a user typed in a file name
		if(typeof $scope.csvName === "undefined"){
			$("#systemAlerts #alert").html("Please enter a valid file name first.");
			$("#systemAlerts").removeClass().addClass("alert-box alert");
			$("#systemAlerts").show();
			return 1;
		}

		var fileName = $scope.csvName;
		
		// Checks if the file name has an extension, if it doesn't add it.
		if(fileName.indexOf(".csv") < 0){
			fileName += ".csv";
		}

		var data = $scope.tweets;
		var csvData = '';
		// Setups the header row
		for(var key in data[0]){
			csvData += '"'+key +'",';
		}
		csvData = csvData.slice(0, -1);
		csvData += '\r\n';

		// Copies the rest of the tweet data to the csv
		for(var key in data){
			for(tweetInfo in data[key]){
				var tmp = data[key][tweetInfo];
				//info is the user entered text, so put it in double quotes.
				if(tweetInfo == "text"){
					csvData += '"""'+ tmp +'""",';
				}
				else if(typeof tmp == "object"){
					csvData += '"'+ JSON.stringify(tmp) +'",';
				}
				else {
					csvData += '"'+ tmp +'",';
				}
				
			}
			csvData = csvData.slice(0, -1);
			csvData += '\r\n';

		}

		$("#systemAlerts").removeClass().addClass("alert-box success");
		$("#systemAlerts #alert").html("File successfully converted!");
		$("#systemAlerts").show();

		// Sets up the download link
		$("#CSVdownloadLink").html('Download '+fileName);
		$("#CSVdownloadLink").attr('href','data:text/csv;charset=utf-8,' + escape(csvData));
		$("#CSVdownloadLink").attr('download', fileName);
		$("#CSVdownloadLink").addClass("small button round success");
		
		$("#CSVdownloadLink").click(function(){
			$("#CSVdownloadLink").html("");
		});
	}

	$scope.convertJSON = function() {
		// Checks if a user typed in a file name
		if(typeof $scope.jsonName === "undefined"){
			$("#systemAlerts #alert").html("Please enter a valid file name first.");
			$("#systemAlerts").removeClass().addClass("alert-box alert");
			$("#systemAlerts").show();
			return 1;
		}

		var fileName = $scope.jsonName;
		
		// Checks if the file name has an extension, if it doesn't add it.
		if(fileName.indexOf(".json") < 0){
			fileName += ".json";
		}

		$("#systemAlerts").removeClass().addClass("alert-box secondary");
		$("#systemAlerts #alert").html("Converting mongoDB to "+fileName);

		var data = $scope.tweets;
		var jsonData = '[';

		for(var tweet in data){
			delete data[tweet]['_id'];
			var tmp = JSON.stringify(data[tweet]);
			jsonData += tmp + ",";
		}

		jsonData = jsonData.slice(0,-1);
		jsonData += "]";

		// Sets up the download link
		$("#JSONdownloadLink").html('Download '+fileName);
		$("#JSONdownloadLink").attr('href','data:text/csv;charset=utf-8,' + escape(jsonData));
		$("#JSONdownloadLink").attr('download', fileName);
		$("#JSONdownloadLink").addClass("small button round success");
	

		$("#systemAlerts").removeClass().addClass("alert-box success");
		$("#systemAlerts #alert").html("File successfully converted!");
		$("#systemAlerts").show();

		$("#JSONdownloadLink").click(function(){
			$("#JSONdownloadLink").html("");
		});
	}

	// sends request to clear db and add new tweets
	$scope.refreshTweets = function() {
		$.post("/refreshTweets",{numTweets: $scope.numTweetsDB}, function(data){
			$("#systemAlerts #alert").html(data);
			$("#systemAlerts").removeClass().addClass("alert-box success");
			$("#systemAlerts").show();
		});
	}

	// sends request to add more tweets to db
	$scope.getMoreTweets = function() {
		var moreTweets = prompt("How many more tweets would you like?","10");

		$.post("/getMoreTweets", {numTweets: moreTweets}, function(data){
			$("#systemAlerts #alert").html(data);
			$("#systemAlerts").removeClass().addClass("alert-box success");
			$("#systemAlerts").show();
		})
	}

	// my attempt at a live stream...didn't go so well.
	function liveTwitStream() {

		var socketClient = io.connect('localhost:3000/');
		var count = 0;
		var liveTweets = [];
		socketClient.on('tweet', function (data) {
			liveTweets.push(data);
			count++;

			if(count == 11){
				socketClient.disconnect();
			}
		});

		socketClient.on('disconnect', function(){
			//If user wants more than 5 tweets, manually add first 5 then recursively add the rest.
    		for(var i=0;i<5;i++) {
    			console.log(liveTweets[i]);
				$("#twitterFeed").append('<li class="tweet" id="tweet'+i+'"><img class="profile_pic" src="'+liveTweets[i]["user"]["profile_image_url"]+'" onError="noProfile(this)"/>'+liveTweets[i]["text"]+"</li>");
				$("#tweet"+i).append("<span class='author'>-- "+liveTweets[i]["user"]["screen_name"]+"</span>");	
			}
			tweetTickerLive(liveTweets, i, 10);
		});
	}

	$scope.changeLiveStream = function() {
		alert("stream start");
		var liveStream = $scope.liveStream;
		// var socketClient = io.connect('localhost:3000/');
		$("#twitterFeed").html("");
		if(liveStream){
			liveTwitStream();
		} else {
			var data = $scope.tweets;
			for(var i=0;i<5;i++) {
				$("#twitterFeed").append('<li class="tweet" id="tweet'+i+'"><img class="profile_pic" src="'+data[i].user_profile_image_url+'" onError="noProfile(this)"/>'+data[i].text+"</li>");
				$("#tweet"+i).append("<span class='author'>-- "+data[i].user_screen_name+"</span>");
			}
			if(data.length > 5){
	    		tweetTicker(data,4, data.length-1);
			}
		}

	}

	// Generates the json object that holds the device info.
	function generateDoughnut(value, label){
		var temp = {};
		var r = randomColorFactor();
		var g = randomColorFactor();
		var b = randomColorFactor();

		temp.value = value;
		temp.label = label;
		temp.color = 'rgba(' + r + ',' + g + ',' + b + ',.7)';
		temp.highlight = 'rgb(' + r + ',' + g + ',' + b + ')';

		return temp;
	}

	// initial load of visualization page, load all three visualizations.
	$scope.tweetVisualization = function(){
		visualizeDevices();
		visualizeLanguages();
		visualizeTimeZones();
		$(".mainProg").show();
	};

	// Gets all the different devices used to send tweets, combines like devices (i.e. iPhone and iPad), and generates the doughnut graph
	function visualizeDevices() {
		$.ajax({
			url:"/visualizeDevices",
			type:"GET",
			beforeSend: function(){
				$("#visualizeCanvasHolder li:nth-child(4)").append("<div id='loading1'>Loading Device Doughnut Chart...</div>");
			}, 
			success: function(data){	
				$("#loading1").remove();			
				var doughnutData = {};
				var r,g,b;
				for(device in data){
					r = randomColorFactor();
					g = randomColorFactor();
					b = randomColorFactor();

					var tmp = device.toLowerCase();

					if(tmp.indexOf("iphone") >= 0 || tmp.indexOf("ipad") >= 0){
						if("iPhone" in doughnutData){
							doughnutData["iPhone"].value += data[device];
						} else {
							doughnutData["iPhone"] = generateDoughnut(data[device], "iPhone");
						}
					} else if(tmp.indexOf("android") >=0){
						if("Android" in doughnutData){
							doughnutData["Android"].value += data[device];
						} else {
							doughnutData["Android"] = generateDoughnut(data[device], "Android");
						}
					} else if(tmp.indexOf("web") >=0){
						if("Web" in doughnutData){
							doughnutData["Android"].value += data[device];
						} else {
							doughnutData["Web"] = generateDoughnut(data[device], "Web");
						}
					} else if(tmp.indexOf("blackberry") >= 0){
						if("BlackBerry" in doughnutData){
							doughnutData["BlackBerry"].value += data[device];
						} else {
							doughnutData["BlackBerry"] = generateDoughnut(data[device], "BlackBerry");
						}
					} else {
						if("Others" in doughnutData){
							doughnutData["Others"].value += data[device];
						} else {
							doughnutData["Others"] = generateDoughnut(data[device], "Others");
						}
					}
				}

				for(key in doughnutData){
					$("#visualizeDevicesKey").append("<li id='"+key+"'><span class='normalTxt'>"+key+"</span></li>");
					$("#"+key).css("color",doughnutData[key].color);
				}

				var ctx = document.getElementById("visualizeDevicesChart").getContext("2d");
				window.myDoughnut = new Chart(ctx).Doughnut(doughnutData, {responsive : true});
			}
		});
	}

	// Gets all the different types of user languages, and displays the data in a nice bar graph.
	function visualizeLanguages(){
		$.ajax({
			url:"/visualizeLanguages", 
			type:"GET",
			beforeSend: function(){
				$("#visualizeCanvasHolder li:nth-child(5)").append("<div id='loading2'>Loading Languages Bar Graph ...</div>");
			}, 
			success: function(data){
				$("#loading2").remove();	
				var barChartData = {
					labels : [],
					datasets: []
				}

				var r = randomColorFactor();
				var	g = randomColorFactor();
				var	b = randomColorFactor();

				var temp = {};
					temp.fillColor = 'rgba(' + r + ',' + g + ',' + b + ',.5)';
					temp.strokeColor = 'rgba(' + r + ',' + g + ',' + b + ',.8)';
					temp.highlightFill = 'rgba(' + r + ',' + g + ',' + b + ',.75)';
					temp.highlight = 'rgba(' + r + ',' + g + ',' + b + ',1)';
					temp.data = [];

				barChartData.datasets.push(temp);

				for(lang in data){
					barChartData.labels.push(lang);
					barChartData.datasets[0].data.push(data[lang]);
				}

				$("#visualizeLanguagesKey").html("The bar graph above shows the difference in languages.");

				var ctx = document.getElementById("visualizeLanguagesChart").getContext("2d");
				window.myBar = new Chart(ctx).Bar(barChartData, {responsive : true});
		
			}
		});
	}

	// Gets all the different user time zones, parses the data, and generates a pie chart.
	function visualizeTimeZones(){
		$.ajax({
			url:"/visualizeTimeZones",
			type:"GET",
			beforeSend: function(){
				$("#visualizeCanvasHolder li:nth-child(6)").append("<div id='loading3'>Loading Time Zone Pie Chart...</div>");
			}, 
			success: function(data){
				$("#loading3").remove();
				var pieData = [];
				var r,g,b, key;
				for(timeZone in data){
					r = randomColorFactor();
					g = randomColorFactor();
					b = randomColorFactor();

					var temp = {};
					temp.value = data[timeZone];
					if(timeZone != "null"){
						temp.label = timeZone;
					} else {
						temp.label = "Other";
					}
					
					temp.color = 'rgba(' + r + ',' + g + ',' + b + ',.7)';
					temp.highlight = 'rgb(' + r + ',' + g + ',' + b + ')';
					
					key = temp.label.replace(/[\s()&\/]/g, '');

					$("#visualizeTimeZonesKey").append("<li id='"+key+"'><span class='normalTxt'>"+temp.label+"</span></li>");
					$("#"+key).css("color",temp.color);

					pieData.push(temp);
				}

				var ctx = document.getElementById("visualizeTimeZoneChart").getContext("2d");
				window.myPie = new Chart(ctx).Pie(pieData, {responsive : true});
			}
		});


	}

	// Adds new tweet to the bottom of the list, then removes the top tweet from the list,
	function tweetTicker(data,curTweet, end){
		setTimeout(function(){
			$('#twitterFeed li:first').animate( {marginTop: '50px'}, 1000, function(){
				$("#twitterFeed").append("<li class='tweet' id='tweet"+curTweet+"'><img class='profile_pic' src='"+data[curTweet].user_profile_image_url+"' onError='noProfile(this)'/>"+data[curTweet].text+"</li>");
				$("#tweet"+curTweet).append("<span class='author'>-- "+data[curTweet].user_screen_name+"</span>");
				$(this).detach();
			});
			curTweet++;
			if(curTweet < end && ($scope.liveStream === false || $scope.liveStream === undefined)){
				tweetTicker(data, curTweet, end);
			}
		}, 4000);
	}

	// Adds new tweet to the bottom of the list, then removes the top tweet from the list,
	function tweetTickerLive(data, curTweet, end){		
		setTimeout(function(){
			console.log(data[curTweet]);
			$('#twitterFeed li:first').animate( {marginTop: '50px'}, 1000, function(){
				$("#twitterFeed").append('<li class="tweet" id="tweet'+curTweet+'"><img class="profile_pic" src="'+data[curTweet]["user"]["profile_image_url"]+'" onError="noProfile(this)"/>'+data[curTweet]["text"]+"</li>");
				$("#tweet"+curTweet).append("<span class='author'>-- "+data[curTweet]["user"]["screen_name"]+"</span>");	
				
				$(this).detach();
			});
			curTweet++;
			if(curTweet < end && $scope.liveStream === true){
				tweetTickerLive(data, curTweet, end);
			} else {
				// setTimeout(function(){
				liveTwitStream();
				// alert("done");
				
				// }, 1000);
			}
		}, 4000);

		liveTwitStream();
	}

	// Shouldn't need this function, since the tweets are scraped live from Twitter.
	function noProfile(profilePic){
		profilePic.onerror = "";
		profilePic.src = "resources/imgs/no-profile.png";

		return true;
	}

	// Generates a random color code.
	function randomColorFactor(){ return Math.round(Math.random()*255)};

});
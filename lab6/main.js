

var angApp = angular.module('TwitterFeed', []);

angApp.controller("TwitterCtrl", function($scope, $http){
	
	$scope.getTweets = function() {
		$("#twitterFeed").html("");
		$http.get("./filter-tweets.json").success(function(data) {

			//If user wants to display 5 or less tweets just manually add them.
			if($scope.numberTweets < 6){
	    		for(var i=0;i<$scope.numberTweets;i++) {
					$("#twitterFeed").append('<li class="tweet" id="tweet'+i+'"><img class="profile_pic" src="'+data[i].user.profile_image_url+'" onError="noProfile(this)"/>'+data[i].text+"</li>");
					$("#tweet"+i).append("<span class='author'>-- "+data[i].user.screen_name+"</span>");
				}
	    	} else {
	    		//If user wants more than 5 tweets, manually add first 5 then recursively add the rest.
	    		for(var i=0;i<5;i++) {
					$("#twitterFeed").append('<li class="tweet" id="tweet'+i+'"><img class="profile_pic" src="'+data[i].user.profile_image_url+'" onError="noProfile(this)"/>'+data[i].text+"</li>");
					$("#tweet"+i).append("<span class='author'>-- "+data[i].user.screen_name+"</span>");
				}
	    		tweetTicker(data,i, $scope.numberTweets);
	    	}

	    	// Adds new tweet to the bottom of the list, then removes the top tweet from the list,
			function tweetTicker(data,curTweet, end){
				setTimeout(function(){
					$('#twitterFeed li:first').animate( {marginTop: '50px'}, 1000, function(){
						$("#twitterFeed").append("<li class='tweet' id='tweet"+curTweet+"'><img class='profile_pic' src='"+data[curTweet].user.profile_image_url+"' onError='noProfile(this)'/>"+data[curTweet].text+"</li>");
						$("#tweet"+curTweet).append("<span class='author'>-- "+data[curTweet].user.screen_name+"</span>");
						$(this).detach();
					});
					curTweet++;
					if(curTweet < end){
						tweetTicker(data, curTweet, end);
					}
					
				}, 4000);
			}

			// Shouldn't need this function, since the tweets are scraped live from Twitter.
			function noProfile(profilePic){
				profilePic.onerror = "";
				profilePic.src = "./no-profile.png";

				return true;
			}

		});

	}

	$scope.convertJSON = function() {
		// Checks if a user typed in a file name
		if(typeof $scope.csvName === "undefined"){
			alert("Please enter a valid file name first.");
			return 1;
		}

		var fileName = $scope.csvName;
		
		// Checks if the file name has an extension, if it doesn't add it.
		if(fileName.indexOf(".csv") < 0){
			fileName += ".csv";
		}

		alert("Converting filter-tweets.json to "+fileName);

		$http.get("./filter-tweets.json").success(function(data) {

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

			// Sets up the download link
			$("#downloadLink").html('Download '+fileName);
			$("#downloadLink").attr('href','data:text/csv;charset=utf-8,' + escape(csvData));
			$("#downloadLink").attr('download', fileName);

			alert("File successfully converted!");

			$("#downloadLink").click(function(){
				$("#downloadLink").html("");
			})

		});

	}

});
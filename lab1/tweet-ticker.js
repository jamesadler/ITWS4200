
// Adds new tweet to the bottom of the list, then removes the top tweet from the list,
function tweetTicker(data,curTweet){
	setTimeout(function(){
		$('#twitterFeed li:first').animate( {marginTop: '50px'}, 1000, function(){
			$("#twitterFeed").append("<li class='tweet' id='tweet"+curTweet+"'><img class='profile_pic' src='"+data[curTweet].user.profile_image_url+"' onError='noProfile(this)'/>"+data[curTweet].text+"</li>");
			$("#tweet"+curTweet).append("<span class='author'>-- "+data[curTweet].user.screen_name+"</span>");
			$(this).detach();
		});
		curTweet++;
		tweetTicker(data, curTweet);
	}, 4000);
};

function noProfile(profilePic){
	profilePic.onerror = "";
	profilePic.src = "./no-profile.png";

	return true;
}

$(document).ready(function(){

	$.getJSON("./tweets.json", function(data){

		// Loads the first 5 tweets
		for(var i=0;i<5;i++) {
			$("#twitterFeed").append('<li class="tweet" id="tweet'+i+'"><img class="profile_pic" src="'+data[i].user.profile_image_url+'" onError="noProfile(this)"/>'+data[i].text+"</li>");
			$("#tweet"+i).append("<span class='author'>-- "+data[i].user.screen_name+"</span>");
		}

		// Recursive function to remove the first tweet and append a new one to the bottom of the list
		tweetTicker(data,i);

	});
});

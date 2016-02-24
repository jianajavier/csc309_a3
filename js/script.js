$(document).ready(function(){
  /**
  * To start, hide info fields and fade in buttons and text input fields.
  */
  $("#allusers, #externals, #userinfo, #tweetinfo, #usecolours").hide();

  $("#getallusersbutton, #getalltweetsbutton, #searchtweet, #searchuser, #externallinks, #editscreenname, #edittweetid").hide().fadeIn(300).delay(100).animate({
      'top': '-=200'
  });

  /**
  * To show all tweets in JSON file.
  */
  $("#getalltweetsbutton").click(function(){
          $.ajax({url: "all_tweets/", success: function(result){
            var obj = JSON.parse(result);
            $("#alltweets").html('');

            for (var i = 0; i < obj.tweets.length; i++) {
              $("#alltweets").append('<h1>' + obj.tweets[i].screen_name + ': </h1>');
              $("#alltweets").append('<p>' + obj.tweets[i].text + '</p>');
              $("#alltweets").append('<h2>' + obj.tweets[i].created_at + '</h2>')
              $("#alltweets").append('<h2><b>ID: </b>' + obj.tweets[i].id_str + '</h2>')
            }

          }});
  });

  /**
  * To show all users in JSON file.
  */
  $("#getallusersbutton").click(function(){
      $.ajax({url: "all_users/", success: function(result){
        var obj = JSON.parse(result);
        $("#allusers").fadeIn(200);
        $("#allusers").html('');

        for (var i = 0; i < obj.users.length; i++) {
          $("#allusers").append('<p><b>'+ obj.users[i]["name"] + '</b><br>' + obj.users[i]["screen_name"] + '</p>');
        }
      }});
  });

  /**
  * To show all external links mentioned in tweets in JSON file.
  */
  $("#externallinks").click(function(){
      $.ajax({url: "external_links/", success: function(result){
        var links = JSON.parse(result);
        $("#externals").fadeIn(200);
        $("#externals").html('');

        for (i = 0; i < links.length; i++) {
          $("#externals").append('<p>' + links[i] + '</p>');
        }
      }});
  });
var usebackground = false;
  /**
  * For search user by screen name function.
  */
  $("#searchuser").click(function(){
    var screenname = $("#editscreenname").val();

    $.ajax({url: "search_user/id=" + screenname, success: function(result){
      var obj = JSON.parse(result);

      $("#userinfo").fadeIn(300);
      $("#userinfo").html('');

      if (obj["name"] === undefined) {
        $("#userinfo").append("No user found.");
      } else {
        $("#usecolours").show();
        $("#userinfo").append('<p><b>'+ obj["name"] + '</b><br>' + obj["screen_name"] + '<br><br><b>Description: </b>'+ obj["description"] + '</p>');
        if (obj["verified"] === true){
          $("#userinfo").append('<p><b> Verified </b></p>');
        }
        $("#userinfo").append()
        $("#userinfo").append('<p><b>ID: </b>'+ obj["id_str"] + '<br><b>Location: </b>' + obj["location"] + '<br><b>URL: </b>'+ obj["url"] + '<br><b>Followers: </b>'+ obj["followers_count"] +'</p>');
        $("#userinfo").append('<p><b>Friends: </b>'+ obj["friends_count"] + '<br><b>Favorites: </b>' + obj["favourites_count"] +'<br><b>Member Since: </b>'+ obj["created_at"] +'<br><b>Status Count: </b>'+ obj["statuses_count"]+'</p>');

        if (usebackground) {
          $("#userinfo").css('background-color', '#' + obj.profile_background_color);
        } else {
          $("#userinfo").css('background-color', "");

        }

      }
    }});
  });
  /**
    Interesting info extracted: user mentions in ID, and user background colors
  */
  $("#usecolours").click(function(){
    var username = $("#editscreenname").val();

    $.ajax({url: "search_user/id=" + username, success: function(result){
      var obj = JSON.parse(result);
      $("#userinfo").css('background-color', '#' + obj.profile_background_color);
      usebackground = true;
    }});
  });


  /**
  * For search tweet by tweet ID function. Displays important information about tweet.
  */
  $("#searchtweet").click(function(){
    var tweetid = $("#edittweetid").val();

    $.ajax({url: "search_tweet/id=" + tweetid, success: function(result){
      var obj = JSON.parse(result);
      $("#tweetinfo").fadeIn(300);
      $("#tweetinfo").html('');

      if (obj.screen_name === undefined) {
          $("#tweetinfo").append('<p>No tweet found.</p>');
      } else {
        $("#tweetinfo").append('<h1>' + obj.screen_name + ': </h1>');
        $("#tweetinfo").append('<p>' + obj.text + '</p>');
        $("#tweetinfo").append('<h2>' + obj.created_at + '</h2>');
        $("#tweetinfo").append('<h2><b>Retweets: </b>' + obj.retweet_count + '</h2>');
        var hshtg = "";
        for (var j = 0; j < obj.entities.hashtags.length; j++) {
          hshtg += obj.entities.hashtags[j].text + '; ';
        }
        $("#tweetinfo").append('<h2><b>Hashtags: </b>' + hshtg + '</h2>');

        var mentions = "";
        for (j = 0; j < obj.entities.user_mentions.length; j++) {
          mentions += '@' + obj.entities.user_mentions[j].screen_name + '; ';
        }

        $("#tweetinfo").append('<h2><b>Mentions: </b>' + mentions + '</h2>');

        if (obj.geo != undefined) {
          $("#tweetinfo").append('<h2><b>Geo: </b>'+ obj.geo.coordinates + '</h2>');
        }
      }
    }});
  });

});

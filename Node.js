http = require('http');
fs = require('fs');
path = require('path');
url = require("url");

PORT = 3000;

ALLTWEETS_PREFIX = '/all_tweets/';
ALLUSERS_PREFIX = '/all_users/';
EXTERNAL_LINKS = '/external_links/';
SEARCH_USER = '/search_user/id=';
SEARCH_TWEET = '/search_tweet/id=';
JSON_FILE = './favs.json';

MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.txt': 'text/plain'
};

http.createServer(function(request, response) {
	var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);
  console.log('Request: ' + request.url);
  if (request.url == '/') {
    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });

  } else if (request.url.indexOf('.js') != -1) {
    // For reading javascript files
    console.log(filename);
    fs.readFile(filename, function (error, data) {
      if (error) {
        response.writeHead(404, {"Content-type":"text/plain"});
        response.end("No Javascript Page Found.");
      } else {
        response.writeHead(200, {'Content-Type': 'text/javascript'});
        response.write(data);
        response.end();
      }
    });
  } else if(request.url.indexOf('css') != -1) {
    // For loading CSS files
    console.log(filename);
    fs.readFile(filename, function (error, data) {
      if (error) {
        response.writeHead(404, {"Content-type":"text/plain"});
        response.end("No Css Page Found.");
      } else {
        response.writeHead(200, {'Content-Type': 'text/css'});
        response.write(data);
        response.end();
      }
    });
/* ALL TWEETS---------------------------------------------------------------- */
  } else if (request.url.indexOf(ALLTWEETS_PREFIX) == 0) {
      var obj;
      fs.readFile(JSON_FILE, 'utf8', function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);

        var arr = {
          tweets: []
        };

        for (var i = 0; i < obj.length; i++) {
          var item = obj[i];
          arr.tweets.push ({
            "screen_name" : item.user.screen_name,
            "text" : item.text,
            "created_at" : item.created_at,
            "id_str" : item.id_str
          });
        }

        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write(JSON.stringify(arr));
        response.end();
      });
/* ALL USERS---------------------------------------------------------------- */
  } else if (request.url.indexOf(ALLUSERS_PREFIX) == 0) {
      var obj;
      fs.readFile(JSON_FILE, 'utf8', function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);

        var arr = {
          users: []
        };

        // For eliminating duplicates
        var screen_names = [];

        for (var i = 0; i < obj.length; i++) {
          var item = obj[i];

          if (screen_names.indexOf(item.user.screen_name) === -1) {
            arr.users.push ({
              "screen_name" : item.user.screen_name,
              "name" : item.user.name,
            });
            screen_names.push(item.user.screen_name);
          }
        }

        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write(JSON.stringify(arr));
        response.end();
      });
/* EXTERNAL LINKS----------------------------------------------------------- */
  } else if (request.url.indexOf(EXTERNAL_LINKS) == 0) {
      var obj;
      fs.readFile(JSON_FILE, 'utf8', function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);

        var links = [];
        for (var i = 0; i < obj.length; i++) {
          // Two places where links can be: entities.urls.expanded_url array and entities.media.expanded_url.
          if (obj[i].entities.hasOwnProperty("urls")) {
            for (var j = 0; j < obj[i].entities.urls.length; j++) {
              links.push(obj[i].entities.urls[j].expanded_url);
            }
          }
          if (obj[i].entities.hasOwnProperty("media")) {
            for (var j = 0; j < obj[i].entities.media.length; j++) {
              links.push(obj[i].entities.media[j].expanded_url);
            }
          }
        }

        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write(JSON.stringify(links));
        response.end();
      });
/* SEARCH USER-------------------------------------------------------------- */
  } else if (request.url.indexOf(SEARCH_USER) == 0) {
      var screenname = filename.split("=")[1];

      var obj;
      var founduser = "";
      fs.readFile(JSON_FILE, 'utf8', function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);

        for (var i = 0; i < obj.length; i++) {
          if (screenname === obj[i].user["screen_name"]) {
            founduser = obj[i].user;
            break;
          }
        }

        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write(JSON.stringify(founduser));
        response.end();

      });
/* SEARCH TWEET------------------------------------------------------------- */
  } else if (request.url.indexOf(SEARCH_TWEET) == 0) {
    var tweetid = filename.split("=")[1];

    var obj;
    var foundtweet = "";
    fs.readFile(JSON_FILE, 'utf8', function (err, data) {
      if (err) throw err;
      obj = JSON.parse(data);

      var object = {};

      for (var i = 0; i < obj.length; i++) {
        var item = obj[i];

        if (tweetid === item.id_str) {

          object.screen_name = item.user.screen_name;
          object.text = item.text;
          object.created_at = item.created_at;
          object.retweet_count = item.retweet_count;
          object.entities = item.entities;
          object.geo = item.geo;

          break;
        }
      }

      response.writeHead(200, {"Content-Type": "text/plain"});
      response.write(JSON.stringify(object));
      response.end();
    });
  } else {
      // Error 404
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write("Error 404" + "\n");
      response.end();
    }
}).listen(PORT);

console.log('Server running at http://127.0.0.1:' + PORT + '/');

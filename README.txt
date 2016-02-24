README

To run:
1. Open console and navigate to a3 directory
2. enter ’node Node.js’ to start server
3. Open web browser (preferably at maximum size) and enter ‘localhost:3000’

To set JSON file:
1. Open Node.js and set JSON_FILE to ‘./<name-of-json-file>’
2. Make sure JSON file is located in a3 directory

To test A3 requirements:
WITH FRONT END:
1. Click on respective buttons corresponding to requirements

JUST JQUERY SERVER REQUESTS:
All tweets:
http://localhost:3000/all_tweets/

All users:
http://localhost:3000/all_users/

List of external links included in tweets:
http://localhost:3000/external_links/

Details about a given tweet (given tweet’s id)
http://localhost:3000/search_tweet/id=<tweetid>

example: http://localhost:3000/search_tweet/id=311975360667459585

Details about a given user (given user screen name)
http://localhost:3000/search_user/id=<userscreenname>

example: http://localhost:3000/search_user/id=timoreilly

Interesting information:
Under user: 
	Sets background to profile_background_color from user object

Under tweet: 
	Gets list of mentions and list of hashtags in detailed tweet 



——————————————————————————————————
Jiana Javier g5javier CSC309-A3 
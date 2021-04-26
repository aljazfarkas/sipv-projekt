// mongoose is required
var mongoose = require('mongoose');







var FriendsOfFriends = require('friends-of-friends');
var fof = new FriendsOfFriends(mongoose);
// works with or without 'new'
var FriendsOfFriends = require('friends-of-friends')(mongoose);
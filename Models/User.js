const mongoose = require('mongoose');

const Favorite = require('./Favorite').FavoriteSchema; 
const Friendship = require('./Friendship').FriendshipSchema; 
const user = new mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  phone: {
    type: String
  },
  sexe: {
    type: String
  },
  avatar: {
    type: String
  },
  verified: {
    type: Number
  },
  favorites:[Favorite],
  friends:[Friendship]
},{timestamps:true})

const User = mongoose.model('users', user);
module.exports = User
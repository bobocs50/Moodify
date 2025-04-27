

//import express
var express = require('express');
//import router
const router = express.Router();
//import ContractCheckerController
var MoodController = require("../controllers/MoodController");



//route
router.post('/post-queries', MoodController.getMood);

//spotify code
router.get('/login', MoodController.spotifyLogin);
//spotify callback
router.get('/callback', MoodController.spotifyCallback);
//spotify playlist link
router.get('/playlist', MoodController.getPlaylistLink);
//spotify get mood
router.get('/catchmood', MoodController.catchMood);


console.log("MoodRoutes loaded");

module.exports = router;
console.log("ContractCheckerRoutes loaded");
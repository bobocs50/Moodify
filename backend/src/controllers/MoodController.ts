import crypto from 'crypto';
import SpotifyWebApi from 'spotify-web-api-node';
import querystring from 'querystring';
import axios from 'axios';

let accessToken1 = null;
let spotifyPlaylist = null;
//Highest mood score and mood
let mood = null;
let moodScore = null;

// Function to generate a random string for state
function generateRandomString(length: number): string {
    return crypto.randomBytes(Math.floor(length / 2)).toString('hex');
}

//After the user has logged in, Spotify will redirect them to callback URL with a code
exports.spotifyLogin = async (req, res) => {
    try {
        console.log("Spotify login called");
        // Generate the code
        var state = generateRandomString(16);
        req.session.state = state;
        var scope = 'user-read-private user-read-email playlist-modify-private playlist-modify-public';


        res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: process.env.SPOTIFY_CLIENT_ID,
                scope: scope,
                redirect_uri: 'http://127.0.0.1:5001/api/callback',
                state: state
            }));
        
     



        
    } catch (error) {
        console.log("Error fetching mood:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}   



// Get the access token from Spotify after user login
// This is the callback URL that Spotify will redirect to after user login
exports.spotifyCallback = async (req, res) => {
    try {
        console.log("Spotify callback called");

         // Get the code and state from the query parameters
         var code = req.query.code || null;
         var state = req.query.state || null;

        // Verify the state parameter to prevent CSRF attacks
        if (state !== req.session.state) {
          return res.status(400).json({ error: 'State mismatch. Possible CSRF attack.' });
        }

         // Reinitialize Spotify API client
         const spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: 'http://127.0.0.1:5001/api/callback',
        });

        // Get the access token
        console.log("TEST")
        const data = await spotifyApi.authorizationCodeGrant(code);
        console.log("Spotify Authorization Grant response: ", data);
        
        const accessToken = data.body['access_token'];
        const refreshToken = data.body['refresh_token'];

        // Store the access token and refresh token in the session of user
        req.session.accessToken = accessToken;  
        console.log("Session after setting access token: ", req.session);
        req.session.refreshToken = refreshToken
        accessToken1 = accessToken;


        console.log("Authentication successful!");
        res.redirect('http://localhost:3000/');


    } catch (error) {
        if (error.body && error.body.error) {

            console.log("Spotify API Error:", error.body.error);
        } else {
            console.log("Unexpected Error:", error);
        }
        res.status(500).json({ error: "Internal server error" });
    }
}



//get mood from llm flask
exports.getMood = async (req, res) => {

    //Start AI
    try {
        //get list with answers
        //post answers with axios as JSON in post method
        
        //fetch json from frontend
        const answers = req.body.answers;
        console.log("Answers: ", answers);

        const res = await axios.post("http://127.0.0.1:5000/startAi", {
            answers: answers
        }, {
            headers: {
            'Content-Type': 'application/json'
            }
        });

        
        const aiData = res.data;
        console.log("AI Data: ", aiData);

        

        for (const [emotion, score] of Object.entries(aiData)) {
            if (score > moodScore) {
                moodScore = score;
                mood = emotion;
            }
        }
        
        console.log(mood);
        console.log(moodScore);


      } catch (err) {
        console.error("Error", err);
      }





    try {
      

        console.log("Token: ", accessToken1) 
       

        // Set the access token for the Spotify API client
        const spotifyApi = new SpotifyWebApi({
            accessToken: accessToken1,
        });

        // 1. Get the current user's profile to get user ID
        const me = await spotifyApi.getMe();
        const userId = me.body.id;
        console.log("User ID: ", userId);

        // 2. Create a new playlist
        const playlistName = "Vibe of the Day 🎧";
        const playlistDescription = "Created with the help of AI and good vibes";
        const playlist = await spotifyApi.createPlaylist(userId, {
            name: playlistName,
            description: playlistDescription,
            public: false, // or true if you want it public
        });
        const playlistId = playlist.body.id;
        const playlistUrl = playlist.body.external_urls.spotify;

        console.log("Playlist created:", playlistUrl);

        // 3. Add tracks to the playlist based on mood
        const musicList = [
            { mood: "anger", trackIds: ["59WN2psjkt1tyaxjspN8fp", "1fLlRApgzxWweF1JTf8yM5", "6HZILIRieu8S0iqY8kIKhj", "0M3adYbGtyRHACP86dey1H", "1BncfTJAWxrsxyT9culBrj"] },
            { mood: "disgust", trackIds: ["2kRFrWaLWiKq48YYVdGcm8", "4SSnFejRGlZikf02HLewEF", "67Hna13dNDkZvBpTXRIaOJ", "2IqjKEBiz0CdLKdkXhxw84", "5GbVzc6Ex5LYlLJqzRQhuy"] },
            { mood: "fear", trackIds: ["71iSmEeF0qRVyULABxP75P", "2OKo7g3KfmCt3kyLvUAL0g", "0j2T0R9dR9qdJYsB7ciXhf", "6GyFP1nfCDB8lbD2bG0Hq9", "2KvIO4ew1TGnz1VfTJk49g"] },
            { mood: "joy", trackIds: ["60nZcImufyMA1MKQY3dcCH", "5uu0D02efCoFMQiLYFT32e", "69kOkLUCkxIZYexIgSG8rq", "2grjqo0Frpf2okIBiifQKs", "4YaNLEPw3MrIgkGOkBrAh2"] },
            { mood: "neutral", trackIds: ["5MhMXTuVODDF234VDvSxQx", "5DAjrJqXqYtgr67pVhmUeR", "5626KdflSKfeDK7RJQfSrE", "2oh8ESSCozH8GbkWdzcTuM", "6JpQGIi2he6iskzR4aLwPG"] },
            { mood: "sadness", trackIds: ["3D1VUmjj0IlhdHqGConc7C", "3B3eOgLJSqPEA0RfboIQVM", "3ZCTVFBt2Brf31RLEnCkWJ", "7LVHVU3tWfcxj5aiPFEW4Q", "7qH9Z4dJEN0l9bidizW7fq"] },
            { mood: "surprise", trackIds: ["6MYYN85MjM7TARWshRwjyW", "3R0aGgSQNVSPk0hDLTGwS3", "1gk3FhAV07q9Jg77UxnVjX", "1ZVbf755wkzFApNhrGNek3", "5h0M2GbBfvOj8GdG7sIDQT"] },
        ];

        

        const moodTracks = musicList.find((item) => item.mood === mood)?.trackIds || [];
        const trackUris = moodTracks.map((trackId) => `spotify:track:${trackId}`);

        if (trackUris.length > 0) {
            await spotifyApi.addTracksToPlaylist(playlistId, trackUris);
            console.log("Tracks added to playlist");
        } else {
            console.log("No tracks found for the mood:", mood);
        }

        // 4. Send the playlist link back
        res.json({ success: true, playlistUrl });
        spotifyPlaylist = playlistUrl;
        console.log("Playlist URL: ", playlistUrl);
        
    

    } catch (error) {
        console.log("Error fetching mood:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


//return playlist linkto frontend with let spotifyPlaylist
exports.getPlaylistLink = async (req, res) => {
    try {
        console.log("Spotify playlist link: ", spotifyPlaylist);
        res.json({ success: true, playlistUrl: spotifyPlaylist });
    } catch (error) {
        console.log("Error fetching playlist link:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports. = async (req, res) => {
    try {
        console.log("Spotify mood called");
        res.json({ mood: mood });
    } catch (error) {
        console.log("Error fetching mood:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
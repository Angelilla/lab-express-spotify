require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/artist-search', (req, res, next) => {
    
    let {artist} = req.query;

    spotifyApi
        .searchArtists(artist)
        .then(data => {
            //console.log('The received data from the API: ', {data:data.body.artists.items});
            res.render('artistSearchResults', { data:data.body.artists.items });
        })
        .catch(err => console.log('An error while searching artists occurred: ', err));
});

app.get("/albums/:artistId", (req,res, next) => {
    
    let {artistId} = req.params;
    
    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
        //console.log('Artist albums', {albums:data.body.items});
        res.render("albums", {albums:data.body.items})
        })
        .catch(err => console.log('The error occurred: ', err));
});

app.get("/albums/tracks/:albumId", (req,res, next) => {
  
    let {albumId} = req.params;
    
    spotifyApi
        .getAlbumTracks(albumId)
        .then(data => {
        //console.log('Artist albums', {tracks:data.body.items});
        res.render("tracks", {tracks:data.body.items})
        })
        .catch(err => console.log('Something went wrong! ', err)
        );
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

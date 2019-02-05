const express = require('express')
const router = express.Router();
const url = require('url');

var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
  clientId: 'e7d4d57eaa99401aa2510c38519b3cc9',
  clientSecret: 'ebe8a7711712418ca488f197282aa19b'
});


router.get('/', (req, res)=>{
  var query = url.parse(req.url, true).query;
  let word = query['name'].replace(/\s+/g, '+');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  spotifyApi.searchArtists(word)
    .then(function(data) {
      let search_res = {}
      if(data.body.artists.items.length>0){
        search_res.name = data.body.artists.items[0].name;
        search_res.url = data.body.artists.items[0].external_urls.spotify;
        search_res.follower = data.body.artists.items[0].followers.total;
        search_res.popularity = data.body.artists.items[0].popularity;
      }
      res.status(200).send(search_res);
    }, function(err) {
      console.log(err);
      if(err.statusCode=='401'){
        spotifyApi.clientCredentialsGrant().then(
          function(data) {
            spotifyApi.setAccessToken(data.body['access_token']);
            spotifyApi.searchArtists(word).then(
              function(data) {
                let search_res = {}
                if(data.body.artists.items.length>0){
                  search_res.name = data.body.artists.items[0].name;
                  search_res.url = data.body.artists.items[0].external_urls.spotify;
                  search_res.follower = data.body.artists.items[0].followers.total;
                  search_res.popularity = data.body.artists.items[0].popularity;
                }

                res.status(200).send(search_res);
          },
          function(err) {
            res.status(500).send(err);
          })})
      }
      else{
        res.status(500).send(err);
      }
    });

});


module.exports = router;

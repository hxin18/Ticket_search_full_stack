const express = require('express')
const router = express.Router();
const url = require('url');
const geohash = require('ngeohash');
const axios = require('axios');

const api_key = "Ggs4OVuHYOdlG44n"
// GET POST


router.get('/', (req, res)=>{
  var query = url.parse(req.url, true).query;
  let word = query['name'].replace(/\s+/g, '+');
  let sk_url = "https://api.songkick.com/api/3.0/search/venues.json?query="+word+"&apikey="+api_key;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  console.log(sk_url)
  axios.get(sk_url).then(
    sk_res =>{
      if( sk_res.data.resultsPage&&sk_res.data.resultsPage.results&& sk_res.data.resultsPage.results.venue && sk_res.data.resultsPage.results.venue.length>0){
        let venue_id = sk_res.data.resultsPage.results.venue[0].id;
        let next_url = "https://api.songkick.com/api/3.0/venues/"+venue_id+"/calendar.json?apikey="+api_key;
        return axios.get(next_url)
      }
      return {};
    }).then(final_res =>{

      let comming = []
      if(final_res.data&& final_res.data.resultsPage && final_res.data.resultsPage.results && final_res.data.resultsPage.results && final_res.data.resultsPage.results.event){
         let event_info = final_res.data.resultsPage.results.event;
         for( let eve of event_info){
           let event = {}
           if(eve.displayName){
             event.displayName = eve.displayName;
           }
           if(eve.uri){
             event.url = eve.uri;
           }
           if(eve.start){
             event.date = eve.start;
           }
           if(eve.type){
             event.type = eve.type;
           }
           if(eve.performance){
             event.artists = eve.performance.map(x=>x.displayName);
           }
           comming.push(event);
         }

      }
      console.log(comming)
      res.status(200).json({comming});
  })
    .catch(error =>{
      console.log(error)
      res.status(500).send(error);
    })
});


module.exports = router;

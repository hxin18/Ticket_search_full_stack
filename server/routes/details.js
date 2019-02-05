const express = require('express')
const router = express.Router();
const url = require('url');
const geohash = require('ngeohash');
const axios = require('axios');


// GET POST


router.get('/', (req, res)=>{
  var query = url.parse(req.url, true).query;
  let id = query['id'];
  let tm_url = "https://app.ticketmaster.com/discovery/v2/events/"+id+"?apikey=9fsyKGpNBCAwHtVfUuR1IZmOW1Q0hUPP";
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  axios.get(tm_url).then(
    tm_res =>{
      var return_data = {}
      // console.log(tm_res.data)
      if(tm_res.data._embedded){
        return_data.name = tm_res.data.name;
        if(tm_res.data._embedded.attractions)
          return_data.attractions = tm_res.data._embedded.attractions.map(x=>x.name);
        if(tm_res.data._embedded.venues)
          return_data.venue = tm_res.data._embedded.venues.map(x=>x.name);
      }
      if(tm_res.data){
        return_data.Time = tm_res.data.dates.start;
        if(tm_res.data.classifications && tm_res.data.classifications.length>0)
          return_data.category = [tm_res.data.classifications[0].genre.name,tm_res.data.classifications[0].segment.name]
        if(tm_res.data.dates.status)
          return_data.status = tm_res.data.dates.status.code;
      }
      if (tm_res.data.hasOwnProperty("priceRanges")){
        return_data.priceRange = [tm_res.data.priceRanges[0].min,tm_res.data.priceRanges[0].max]
      }
      return_data.url =  tm_res.data.url
      if(return_data.seat_map = tm_res.data.seatmap)
        return_data.seat_map = tm_res.data.seatmap.staticUrl;
      res.status(200).json(return_data);
    })
    .catch(error =>{
      res.status(500).send(error);
    })
});


module.exports = router;

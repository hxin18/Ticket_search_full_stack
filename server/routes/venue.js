const express = require('express')
const router = express.Router();
const url = require('url');
const geohash = require('ngeohash');
const axios = require('axios');


// GET POST


router.get('/', (req, res)=>{
  var query = url.parse(req.url, true).query;
  let word = query['name'].replace(/\s+/g, '+');;
  let tm_url = "https://app.ticketmaster.com/discovery/v2/venues?apikey=9fsyKGpNBCAwHtVfUuR1IZmOW1Q0hUPP&keyword="+word
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  axios.get(tm_url).then(
    tm_res =>{
      venue_data = {}
      if(tm_res.data._embedded && tm_res.data._embedded.venues &&tm_res.data._embedded.venues.length>0){
        ven = tm_res.data._embedded.venues[0]
        if(ven.name)
          venue_data.name = ven.name;
        if(ven.address&& ven.address.line1)
          venue_data.address = ven.address.line1;
        if(ven.boxOfficeInfo&&ven.boxOfficeInfo.phoneNumberDetail)
          venue_data.phone = ven.boxOfficeInfo.phoneNumberDetail;
        if( ven.boxOfficeInfo&&ven.boxOfficeInfo.openHoursDetail)
          venue_data.openhour = ven.boxOfficeInfo.openHoursDetail;
        if(ven.generalInfo&&ven.generalInfo.generalRule)
          venue_data.generalrule = ven.generalInfo.generalRule;
        if(ven.generalInfo&&ven.generalInfo.childRule)
        venue_data.childrule = ven.generalInfo.childRule;
        if(ven.city&&ven.state)
        venue_data.state_city = ven.city.name+","+ven.state.name;
        if(ven.location)
        venue_data.location =  {'lng':parseFloat(ven.location.longitude),'lat':parseFloat(ven.location.latitude)};
      }
      res.status(200).json(venue_data);
    })
    .catch(error =>{
      res.status(500).json(error);
    })
});


module.exports = router;

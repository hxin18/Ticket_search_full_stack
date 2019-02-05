const express = require('express')
const router = express.Router();
const url = require('url');
const geohash = require('ngeohash');
const axios = require('axios');


// GET POST

function get_result_from_tm(keyword, distant, geo_hash,segment,unit){
  if(unit == "Miles"){
    unit = "miles"
  }else{
    unit = "km"
  }
  let full_url = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=9fsyKGpNBCAwHtVfUuR1IZmOW1Q0hUPP&keyword="
    full_url+= keyword;
    full_url+="&segmentId=";
    full_url+=segment
    full_url+= "&radius=";
    full_url+= distant;
    full_url+="&unit="+unit+"&geoPoint="+geo_hash;
    return full_url;

}

router.get('/', (req, res)=>{
  var loc = url.parse(req.url, true).query;
  let location = loc['location'].replace(/\s+/g, '+');
  let here = loc['isUserInput'];
  let distance = loc['distance'];
  let keyword = loc['keyword'];
  let segment = '';
  let category = loc['category'];
  let unit = loc['unit']


  if (category == "Music"){
    segment = "KZFzniwnSyZfZ7v7nJ";
  }
  if (category == "Sports"){
    segment = "KZFzniwnSyZfZ7v7nE";
  }
  if (category == "Arts & Theatre"){
    segment = "KZFzniwnSyZfZ7v7na";
  }
  if (category == "Film"){
    segment = "KZFzniwnSyZfZ7v7nn";
  }
  if (category == "Miscellaneous"){
    segment = "KZFzniwnSyZfZ7v7n1";
  }
  // console.log(here);
  if(here==='true'){
    // console.log(here);
    let fullurl = "https://maps.googleapis.com/maps/api/geocode/json?address="+location+"&key=AIzaSyAi4f00hgHpySIYuyQwEZuQcpehp28lphQ";
    axios.get(fullurl).then(posts=>{
      let result = posts.data["results"][0]["geometry"]["location"]
      let geo = geohash.encode(result["lat"], result["lng"])
      let tm_url = get_result_from_tm(keyword, distance, geo,segment,unit);
      return axios.get(tm_url);
  }).then(
    tm_res =>{
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.setHeader('Access-Control-Allow-Credentials', true);
      res.status(200).json(tm_res.data);

    }).catch(error =>{
      Promise.reject(error.response);
        // res.status(500).send(error);
      })
  }
  else{
    console.log(loc['geoJson'])
    let lat_log = JSON.parse(loc['geoJson'])
    let geo = geohash.encode(lat_log["lat"], lat_log["lng"])
    let tm_url = get_result_from_tm(keyword, distance, geo,segment,unit);
    // console.log(lat_log);
    axios.get(tm_url).then(
      tm_res =>{
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('Access-Control-Allow-Credentials', true);
        // console.log(tm_url);
        // console.log(tm_res.data);
        res.status(200).json(tm_res.data);
      })
      .catch(error =>{
        Promise.reject(error.response);
        res.status(500).send(error);
      })
  }
});


module.exports = router;

const express = require('express')
const router = express.Router();
const url = require('url');
const geohash = require('ngeohash');
const axios = require('axios');


// GET POST


router.get('/', (req, res)=>{
  var query = url.parse(req.url, true).query;
  let word = query['word'];
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  let tm_url = "https://app.ticketmaster.com/discovery/v2/suggest?apikey=9fsyKGpNBCAwHtVfUuR1IZmOW1Q0hUPP&keyword="+ word;
  axios.get(tm_url).then(
      tm_res =>{
        // console.log(tm_res.data._embedded.attractions);
        res.status(200).json(tm_res.data._embedded.attractions);
      })
      .catch(error =>{
        res.status(500).send(error);
      })
});


module.exports = router;

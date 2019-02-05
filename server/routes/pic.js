const express = require('express')
const router = express.Router();
const url = require('url');
const geohash = require('ngeohash');
const axios = require('axios');

const search_id = "003810536942613478262:efr7e5ygoa4"
const api_key = "AIzaSyAi4f00hgHpySIYuyQwEZuQcpehp28lphQ"
// GET POST


router.get('/', (req, res)=>{
  var query = url.parse(req.url, true).query;
  let name = query['name'];
  let gg_url = "https://www.googleapis.com/customsearch/v1?q="+name;
  gg_url += "&cx="+search_id+"&imgSize=huge&imgType=news&num=8&searchType=image&key="+api_key;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  axios.get(gg_url).then(
    gg_res =>{
      let fig = []
      for(let i of gg_res.data.items){
        fig.push(i.link);
      }
      res.status(200).json({fig});
    })
    .catch(error =>{
      Promise.reject(error.response);
      res.status(500).send(error);
    })
});


module.exports = router;

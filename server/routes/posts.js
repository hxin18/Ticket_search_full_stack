const express = require('express')
const router = express.Router();


const axios = require('axios');

const PostAPI = 'https://jsonplaceholder.typicode.com';


// GET POST


router.get('/', (req, res)=>{

  res.send('it works')

});



router.get('/posts', (req, res)=>{

  axios.get(`${PostAPI}/posts`).then(posts=>{

    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Headers', '*');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.status(200).json(posts.data);

  })
    .catch(error =>{
      res.status(500).send(error);
    })
});


module.exports = router;

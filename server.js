const express = require('express');
const path = require('path');
const app  = express();

const search = require('./server/routes/search');
const autocomplete = require('./server/routes/autocomplete')
const details = require('./server/routes/details')
const pic = require('./server/routes/pic')
const venue = require('./server/routes/venue')
const comming = require('./server/routes/comming')
const artist = require('./server/routes/artist')


app.use('/search',search);
app.use('/autocomplete',autocomplete)
app.use('/details',details)
app.use('/pic',pic)
app.use('/venue',venue)
app.use('/comming',comming)
app.use('/artist',artist)


app.use(express.static(path.join(__dirname, 'dist/Ticketsearch')));
app.get('/',(req,res)=>{

  res.sendFile(path.join(__dirname,'dist/Ticketsearch/index.html'));

});



const port = process.env.PORT || 4600;

app.listen(port ,(req,res)=>{

  console.log("RUNNING ON"+port);

});

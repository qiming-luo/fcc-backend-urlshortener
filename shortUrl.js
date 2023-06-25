const express = require('express');
const router = express.Router();
//import valide-url
const validUrl = require('valid-url')
//import replit db
const Database = require("@replit/database"); 
const db = new Database();

/* url will be store as shortUrl: originalUrl 
shortUrl will be 's'+rendom number
each shortUrl will be unique
different shortUrl can share same originalUrl, because different users could shorten the same original url
*/

//define verify-url fn
const verifyUrl = function(url){
  if(validUrl.isWebUri(url)){
    return true;
  }else{
    return false;
  }
}

// parent path: '/api'
// store urls 
router.post('/shorturl', async function(req, res){
  const originalUrl = req.body.url;
  // step 1: verify url
  const validOriginalUrl = verifyUrl(originalUrl);
  // step 2: 
  if(!validOriginalUrl){
    res.json({error: 'invalid url'});
  }else{
    // extract all shortUrls stored in db
    const shortUrls = await db.list(); // return an array
    // shorten url &&  make sure each shortUrl will be unique
    let shortUrl = 's' + Math.floor(Math.random() * 10000); // db can store 9999 shorturl
    while(shortUrls.includes(shortUrl)){
      shortUrl = 's' + Math.floor(Math.random() * 10000); // db can store 9999 shorturl
    }
    // store urls in db
    await db.set(shortUrl, originalUrl);
    // send back info
    res.json({
      original_url: originalUrl,
      short_url: shortUrl
    })
  }
  
});

// redirect url
router.get('/shorturl/:shortUrl', async function(req, res){
  const shortUrlInputed = req.params.shortUrl;
  // get originalUrl
  const originalUrl = await db.get(shortUrlInputed);
  if(!originalUrl){
    res.status(400).json({error: 'no such short_url'});
  }else{
    res.redirect(originalUrl);
  }
})

module.exports = router;


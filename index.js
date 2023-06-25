require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(require('morgan')('dev'));
app.use(cors());
//body-parser
app.use(express.urlencoded({extended: true}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// api router
const shortenUrlApi = require('./shortUrl.js');
app.use('/api', shortenUrlApi);

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

'use strict'

/**
 * Module dependencies.
 */

var express = require('express');
var logger = require('morgan');
var path = require('path');
var app = express();

var fs = require("fs");

const https = require("https");


// log requests
app.use(logger('dev'));

app.use(function (req, res, next) {
   // res.setHeader('Set-Cookie', 'site1-cross-site=site1Value; partitioned')
    next(); // <-- important!
});



// express on its own has no notion
// of a "file". The express.static()
// middleware checks for a file matching
// the `req.path` within the directory
// that you pass it. In this case "GET /js/app.js"
// will look for "./public/js/app.js".

// app.use(express.static(path.join(__dirname, 'public')));

// if you wanted to "prefix" you may use
// the mounting feature of Connect, for example
// "GET /static/js/app.js" instead of "GET /js/app.js".
// The mount-path "/static" is simply removed before
// passing control to the express.static() middleware,
// thus it serves the file correctly by ignoring "/static"

// if for some reason you want to serve files from
// several directories, you can use express.static()
// multiple times! Here we're passing "./public/css",
// this will allow "GET /style.css" instead of "GET /css/style.css":
// app.use(express.static(path.join(__dirname, 'public', 'css')));

// app.listen(1000);
// console.log('listening on port 1000', __dirname);


app.get('/sso', (req, res, next) => {
  // let data = req.body;
  // res.send('Data Received: ' + JSON.stringify(data));
// console.log(req);
  res.redirect('https://www.connect11.com:2003/sign-in?destination=https://www.site11.com:2001?source=customer')
});

app.use('/*', express.static(path.join(__dirname, '/')));


https
  .createServer(
		// Provide the private and public key to the server by reading each
		// file's content with the readFileSync() method.
    {
      key: fs.readFileSync(path.join(__dirname, 'www.site11.com+2-key.pem')),
      cert: fs.readFileSync( path.join(__dirname, 'www.site11.com+2.pem'))
    },
    app
  )
  .listen(2001, () => {
    console.log("serever is runing at port 2002");
  });

// console.log('try:');
// console.log('  GET /hello.txt');
// console.log('  GET /js/app.js');
// console.log('  GET /css/style.css');


'use strict'

/**
 * Module dependencies.
 */

var express = require('express');
var logger = require('morgan');
var path = require('path');
var app = express();

var cookieParser = require('cookie-parser');

var { createHash } = require('crypto');

var URL = require('url').URL;



var storage = require('./storage');

var https = require("https");

var fs = require("fs");
const { request } = require('http');
// log requests
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());



// app.use('/', function (req, res, next) {
//     console.log("yes.......")
//     res.setHeader('Set-Cookie', 'connect-auth-cookie=authCookie; Partitioned; Secure; HttpOnly; SameSite=None;')
//     next(); // <-- important!
//  });


// express on its own has no notion
// of a "file". The express.static()
// middleware checks for a file matching
// the `req.path` within the directory
// that you pass it. In this case "GET /js/app.js"
// will look for "./public/js/app.js".

// app.use(express.static(path.join(__dirname, 'public')));

// // if you wanted to "prefix" you may use
// // the mounting feature of Connect, for example
// // "GET /static/js/app.js" instead of "GET /js/app.js".
// // The mount-path "/static" is simply removed before
// // passing control to the express.static() middleware,
// // thus it serves the file correctly by ignoring "/static"




app.use("/static/", express.static(path.join(__dirname, '/static/')));

app.use("/", express.static(path.join(__dirname, '/')));

app.use('/login', (req, res, next) => {
  res.setHeader('Set-Cookie', 'connect-auth-cookie=authCookie; Partitioned; Secure; HttpOnly; SameSite=None;Path=/;');
  res.sendFile(path.join(__dirname, 'login.html'));
  console.log("Login Successfull");
  // res.end();
});

app.use('/clearall', (req, res) => {
  res.setHeader('set-cookie', 'connect-auth-cookie=authCookie; Partitioned; Secure; HttpOnly; SameSite=None;Path=/; max-age=0');
  res.end();
});


app.use('/authorize', (req, res, next) => {
  res.json({ cookies: req.headers.cookie ? req.headers.cookie : "" });
  res.end();
});


app.get('/sign-in', (req, res, next) => {

  // var key = `${new URL(req.query.destination).hostname}:${req.headers.host.split(":")[0]}`;
   var authCode = new Date().getTime();

  // console.log("before", key, storage.get(key));

  // if (storage.has(key)) {
  //   var entry = storage.get(key);
  //   entry.authCode = authCode;
  //   entry.accessToken = "token";
  //   storage.set(key, entry);
  // } else {
  //   storage.set(key, {
  //     authCode: authCode,
  //     accessToken: "token"
  //   });
  // }

  storage.set(authCode+"code", {
    authToken: "token",
    code: authCode
  });

  var url = new URL(req.query.destination);
  url.searchParams.append("connect_auth_code", authCode);

  console.log("new storage", authCode, storage.get(authCode));

  res.redirect(url.href);
  res.end();
});


app.get('/get-hash', (req, res) => {
  var code = Buffer.from(createHash('sha256').update(req.query.verifier || "bacon").digest()).toString('base64');
  res.send(req.headers.host.split(":")[0]);
  // console.log(req);
  res.end();
});



function validateCodeChallenge(verifier, cookie) {
  console.log("cookie", cookie, verifier );
  return cookie == Buffer.from(createHash('sha256').update(verifier || "bacon").digest()).toString('base64');
}


function getCodeChallengeCookie(cookie){
  return `connect-auth-code-challenge=${cookie}; Partitioned; Secure; HttpOnly; SameSite=None;Path=/;`;
}


app.post('/tokenCodeChallenge', (req, res, next) => {

  var response = {};
  var key = `${req.body.destination}:${req.body.alias}`;
  console.log("before", key, storage.get(key));

  if (req.cookies["connect-auth-cookie"]) {
    response.accessToken = req.cookies["connect-auth-cookie"];
    res.json(response);
    res.end();
    return;
  }

  if (storage.has(key)) {
    var entry = storage.get(key);
    entry.code_challenge = req.body.code_challenge;
    storage.set(key, entry);
  } else {
    storage.set(key, {
      code_challenge: req.body.code_challenge
    });
  }
  console.log("after", key, storage.get(key));
  res.json(response);
  res.end();
});



app.post('/tokenCodeChallengeCookie', (req, res, next) => {
  var response = {};
  var key = `${req.body.destination}:${req.body.alias}`;
  console.log("before", key, storage.get(key));

  if (req.cookies["connect-auth-cookie"]) {
    response.authToken = req.cookies["connect-auth-cookie"];
    res.json(response);
    res.end();
    return;
  }

  res.setHeader('set-cookie', `connect-auth-code-challenge=${req.body.code_challenge}; Partitioned; Secure; HttpOnly; SameSite=None;Path=/;`);
  res.json(response);
  res.end();
});



app.post('/getToken', (req, res) => {

  console.log("starting getToken", req.body);

  if (req.cookies["connect-auth-cookie"]) {
    console.log("Login session exists");
    res.json({success: true, authToken:req.cookies["connect-auth-cookie"] });
    res.end();
    return;
  }

  console.log("retriving storage", req.body.connect_auth_code, storage.get(req.body.connect_auth_code+"code"));


  var key = req.body.connect_auth_code+"code";

  if(req.body.connect_auth_code && storage.has(key)){
    console.log("Key exists", req.body.connect_auth_code,  req.cookies["connect-auth-code-challenge"]);
    var entries = storage.get(key); 
    if(validateCodeChallenge(req.body.code_verifier, req.cookies["connect-auth-code-challenge"])){
      storage.delete(key);
      res.setHeader('set-cookie', [
        `connect-auth-cookie=${entries.authToken}; Partitioned; Secure; HttpOnly; SameSite=None;Path=/;`,
        'connect-auth-code-challenge=dummy; Partitioned; Secure; HttpOnly; SameSite=None;Path=/; max-age=0'
    ]);
    res.json({success: true, authToken: entries.authToken});
    res.end();
    return;
    }else{
      res.json({success: false});
      res.end();
      return;
    }
  }else if(req.body.code_challenge){
    console.log("Save code_challenge");
    var codeChallengeCookie = getCodeChallengeCookie(req.body.code_challenge);
    res.setHeader('set-cookie', [codeChallengeCookie]);
    res.json({success: true});
    res.end();
    return;
  }

  console.log("Login session doesn't exists need to login");

  res.json({success: false});
  res.end();
});






// if for some reason you want to serve files from
// several directories, you can use express.static()
// multiple times! Here we're passing "./public/css",
// this will allow "GET /style.css" instead of "GET /css/style.css":
// app.use(express.static(path.join(__dirname, 'public', 'css')));

// app.listen(3000);
// console.log('listening on port 3000');
// console.log('try:');
// console.log('  GET /hello.txt');
// console.log('  GET /js/app.js');
// console.log('  GET /css/style.css');


console.log(path.join(__dirname, '/'));

https
  .createServer(
    // Provide the private and public key to the server by reading each
    // file's content with the readFileSync() method.
    {
      key: fs.readFileSync(path.join(__dirname, 'www.site11.com+2-key.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'www.site11.com+2.pem'))
    },
    app
  )
  .listen(2003, () => {
    console.log("serever is runing at port 2001");
  });
/**
 * Copyright (c) 2017 Geraldo A. Perez
 */
'use strict'

 /**
  * NodeJS module - Enables to use express functions
  */
var express = require('express')
var bodyParser = require('body-parser')

var app = express() // Initialization for better readability of the code

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

app.use(bodyParser.text({type: 'application/json'}))

// respond with message when a GET request is made to the homepage 
app.get('/', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'}); // Setting content type for head
    res.end('This is the main page of the bot api!');
});

// respond with validation when a GET request is made to the webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === 'my_special_mentor_bot_is_the_token') {
            res.send(req.query['hub.challenge']);
    }
    else {
        res.sendStatus(400);
    }
})

app.post('/webhook', function (req, res) {
    try {
        const data = JSONbig.parse(req.body);
        console.log(data);   
    } catch (error) {
        return res.status(400).json({
            status: "error",
            error: err
        });
    }
})

// [TEST] Logs the port and writes to console
app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
/**
 * Copyright (c) 2017 Geraldo A. Perez
 */
'use strict'

const FB_PAGE_ACCESS_TOKEN = 'EAAFT9mFPdlYBAATuUVY9rwqAgBi1xJJTSYmRJbOGVyFCZBdzJYVjCIFrvsMCSeUlpVgEy1VOWSZBiSfOg91tgWpfVjSWPw9fJXOswAmziEDiy3q7Ispbu9MuxAeZCK82h8TuDDTyT8dp5jLvTZCxMif6lIPJcUyC3FZBKPUDzE9oHPE3pVMxX'

 /**
  * NodeJS module - Enables to use express functions
  */
var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')

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

// respond with the message when a POST request is made to the webhook
app.post('/webhook', function (req, res) {
    try {
        console.log("We are going to try to get data")
        const data = JSON.parse(req.body);
        console.log(data);

        if (data.entry) {
            let entries = data.entry;
            entries.forEach((entry) => {
                let messaging_events = entry.messaging;
                if (messaging_events) {
                    messaging_events.forEach((event) => {
                        console.log(event);
                        if (event.message && !event.message.is_echo) {
                            return new Promise((resolve, reject) => {
                                request({
                                    url: 'https://graph.facebook.com/v2.6/me/messages',
                                    qs: {access_token: FB_PAGE_ACCESS_TOKEN},
                                    method: 'POST',
                                    json: {
                                        recipient: {id: event.sender.id},
                                        message: 'Nigga hey! -__-'
                                    }
                                }, (error, response) => {
                                    if (error) {
                                        console.error('Error sending action: ', error);
                                        reject(error);
                                    } else if (response.body.error) {
                                        console.error('Error: ', response.body.error);
                                        reject(new Error(response.body.error));
                                    }
                    
                                    resolve();
                                });
                            });
                        } else if (event.postback && event.postback.payload) {
                            console.log('Something different');
                        }
                    });
                }
            });
        }
    } catch (err) {
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
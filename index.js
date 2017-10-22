/**
 * Copyright (c) 2017 Geraldo A. Perez
 */
'use strict'

/**
 * Modules
 */
const config = require('./config'); // Import configurations (Tokens, Secrets, etc.)
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const crypto = require('crypto');
const uuid = require('uuid');

const app = express(); // Express app init (Readability Convention)

const FB_PAGE_TOKEN = config.FB_VERIFY_TOKEN || process.env.FB_PAGE_TOKEN;
const FB_VERIFY_TOKEN = config.FB_VERIFY_TOKEN || process.enc.FB_VERIFY_TOKEN;
const FB_APP_SECRET = config.FB_APP_SECRET || process.env.FB_APP_SECRET;

// Configuration Validation
if (!FB_PAGE_TOKEN) {
	throw new Error('missing FB_PAGE_TOKEN');
}
if (!FB_VERIFY_TOKEN) {
	throw new Error('missing FB_VERIFY_TOKEN');
}
if (!FB_APP_SECRET) {
	throw new Error('missing FB_APP_SECRET');
}

// set the port of our application
// process.env.PORT lets the port be set by Heroku
app.set('port', (process.env.PORT || 8080));

// verify request came from facebook
app.use(bodyParser.json({
	verify: verifyRequestSignature
}));

// process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// process application/json
app.use(bodyParser.json())

// respond with message when a GET request is made to the homepage 
app.get('/', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'}); // Setting content type for head
    res.end('This is the main page of the bot!');
})

// respond with validation when a GET request is made to the webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {
            res.send(req.query['hub.challenge']);
    }
    else {
        console.error('Failed validation. Make sure validations token match.')
        res.sendStatus(403);
    }
})

/**
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks
 * for your page.
 *  
 * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
 * 
 * As documented by Jana Bergant in https://github.com/jbergant/chatbot-facebook-nodejs/blob/master/app.js
 */
app.post('/webhook', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
	    let event = req.body.entry[0].messaging[i]
	    let sender = event.sender.id
	    if (event.message && event.message.text) {
		    let text = event.message.text
		    sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200), FB_PAGE_TOKEN)
	    }
    }
    res.sendStatus(200)
})

/**
 * Calls the Send API
 */

function sendTextMessage(sender, text) {
    let messageData = {text:text}
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: config.FB_PAGE_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

/*
 * Verify that the callback came from Facebook. Using the App Secret from 
 * the App Dashboard, we can verify the signature that is sent with each 
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 * 
 * As documented by Jana Bergant in https://github.com/jbergant/chatbot-facebook-nodejs/blob/master/app.js
 */
function verifyRequestSignature(req, res, buf) {
	var signature = req.headers["x-hub-signature"]; // param from request header

	if (!signature) {
		throw new Error('Couldn\'t validate the signature.');
	} else {
		var elements = signature.split('=');
		var method = elements[0];
		var signatureHash = elements[1];

		var expectedHash = crypto.createHmac('sha1', FB_APP_SECRET)
			.update(buf)
			.digest('hex');

		if (signatureHash != expectedHash) {
			throw new Error("Couldn't validate the request signature.");
		}
	}
}

// [TEST] Logging the port starts our server
app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
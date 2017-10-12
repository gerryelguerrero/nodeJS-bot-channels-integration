/**
 * Copyright (c) 2017 Geraldo A. Perez
 */
'use strict'

 /**
  * NodeJS module - Enables to use express functions
  */
  const express = require('express');
  const bodyParser = require('body-parser');
  const Twilio = require('twilio');
  
  const REST_PORT = (process.env.PORT || 8000);
  const TWILIO_SERVICE_ID = process.env.TWILIO_SERVICE_ID;
  const TWILIO_TOKEN = process.env.TWILIO_TOKEN;
  
  const app = express();
  
  app.use(bodyParser.urlencoded({extended: true}));
  
  let client = new Twilio(TWILIO_SERVICE_ID, TWILIO_TOKEN);

  app.get('/smssent', (req, res) => {
  
      console.log('POST sms received');

      var message = req.query.Body;
      var number = req.query.From;
      var twilioNumber = req.query.To;
  
      try {
          console.log(req.query.Body);
          client.messages.create({
              from: twilioNumber,
              to: number,
              body: "Text received: Echo message: " + message
            }, function(err, message) {
                if(err) {
                    console.log(err.message);
                }
            })

      } catch (err) {
          return res.status(400).send('Error while processing ' + err.message);
      }
  });
  
  app.listen(REST_PORT, function () {
      console.log('Rest service ready on port ' + REST_PORT);
  });
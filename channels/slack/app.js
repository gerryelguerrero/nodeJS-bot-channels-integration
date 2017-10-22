/**
 * Copyright (c) 2017 Geraldo A. Perez
 */
'use strict'

 /**
  * Modules
  */
var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;

const SLACK_API_TOKEN = process.env.SLACK_API_TOKEN;

var rtm = new RtmClient(SLACK_API_TOKEN);
rtm.start();

let channel;
let bot;

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
    for (const c of rtmStartData.channels) {
        if (c.is_member && c.name ==='mentorbot_test') { channel = c.id }
    }
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}`);

    bot = rtmStartData.self.id;
});

rtm.on(RTM_EVENTS.MESSAGE, function(message) {
    if (message.channel === channel) {
        if (message.user !== bot)
        {
            rtm.sendMessage("Yo yo yo! My boy<@" + message.user + "> is in the house (channel)", message.channel);
        }
    }
});
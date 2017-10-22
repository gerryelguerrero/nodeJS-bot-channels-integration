/**
 * Copyright (c) 2017 Geraldo A. Perez
 */
'use strict'

/**
 * Bot Channel Config Class
 */
module.exports = class BotChannelConfig {

    get messengerService() {
        return this._messengerService;
    }

    set messengerService(value) {
        this._messengerService = value;
    }

    constructor(messengerService) {
        this._messengerService = messengerService;
    }
}
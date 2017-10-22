/**
 * Copyright (c) 2017 Geraldo A. Perez
 */
'use strict'

/**
 * Bot Class
 */
module.exports = class Bot {

    get botChannelConfig() {
        return this._botChannelConfig;
    }

    set botChannelConfig(value) {
        this._botChannelConfig = value;
    }

    constructor(botChannelConfig) {
        this._botChannelConfig = botChannelConfig;
    }
}
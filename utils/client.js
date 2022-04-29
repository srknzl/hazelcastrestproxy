'use strict';

var { Client } = require('hazelcast-client');

let client;

/**
 * Initialize the client if it is not already initialized. Otherwise return the client.
 * @returns Client instance
 */
exports.getClient = async function() {
    if (!client) {
        client = await Client.newHazelcastClient();
    } 
    return client;
};
'use strict';

var { HazelcastError } = require('hazelcast-client');

exports.errorToJson = function(error) {
    if(error instanceof HazelcastError) {
        return {
            message: error.message,
            stack: error.stack,
            cause: error.cause.stack ? error.cause.stack : null,
            serverStackTrace: error.serverStackTrace ? error.serverStackTrace : null,
        }
    } else {
        return {
            message: error.message,
            stack: error.stack,
            cause: null,
            serverStackTrace: null,
        }
    }
};
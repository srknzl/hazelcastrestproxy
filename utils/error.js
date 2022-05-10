'use strict';

var { HazelcastError } = require('hazelcast-client');

exports.errorToJson = function(error) {
    if(error instanceof HazelcastError) {
        return {
            code: 500,
            payload: {
                message: error.message,
                stack: error.stack,
                cause: error.cause && error.cause.stack ? error.cause.stack : null,
                serverStackTrace: error.serverStackTrace ? error.serverStackTrace : null,
            }
        }
    } else {
        return {
            code: 500,
            payload: {
                message: error.message,
                stack: error.stack,
                cause: null,
                serverStackTrace: null,
            }
        }
    }
};
'use strict';

const ClientUtil = require('../utils/client');
const ErrorUtil = require('../utils/error');

/**
 * Delete an entry from a map
 * Delete an entry from a map using a key
 *
 * body MapNameKey A map name and a key
 * no response value expected for this operation
 **/
exports.mapDelete = function(body) {
  return new Promise(function(resolve, reject) {
    ClientUtil.getClient().then(client => {
      client.getMap(body.mapName).then(map => {
        map.delete(body.key).then(() => {
          resolve();
        }).catch(err => {
          reject(ErrorUtil.errorToJson(err));
        });
      }).catch(err => {
        reject(ErrorUtil.errorToJson(err));
      });
    }).catch(err => {
      reject(ErrorUtil.errorToJson(err));
    });
  });
}


/**
 * Gets a value from a map
 * Given a key, gets a value from a map.
 *
 * body MapNameKey A map name and a key
 * returns inline_response_200
 **/
exports.mapGet = function(body) {
  return new Promise(function(resolve, reject) {
    ClientUtil.getClient().then(client => {
      client.getMap(body.mapName).then(map => {
        map.get(body.key).then(value => {
          resolve({value});
        }).catch(err => {
          reject(ErrorUtil.errorToJson(err));
        });
      }).catch(err => {
        reject(ErrorUtil.errorToJson(err));
      });
    }).catch(err => {
      reject(ErrorUtil.errorToJson(err));
    });
  });
}


/**
 * Set an entry in a map
 * Sets a key-value pair to a Hazelcast Map proxy.
 *
 * body MapSetRequest Map set request
 * no response value expected for this operation
 **/
exports.mapSet = function(body) {
  return new Promise(function(resolve, reject) {
    ClientUtil.getClient().then(client => {
      client.getMap(body.mapName).then(map => {
        map.set(body.key, body.value, body.ttl ? body.ttl : undefined, body.maxIdle ? body.maxIdle : undefined).then(() => {
          resolve();
        }).catch(err => {
          reject(ErrorUtil.errorToJson(err));
        });
      }).catch(err => {
        reject(ErrorUtil.errorToJson(err));
      });
    }).catch(err => {
      reject(ErrorUtil.errorToJson(err));
    });
  });
}


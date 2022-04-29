'use strict';

var utils = require('../utils/writer.js');
var Map = require('../service/MapService');

module.exports.mapDelete = function mapDelete (req, res, next, body) {
  Map.mapDelete(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.mapGet = function mapGet (req, res, next, body) {
  Map.mapGet(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.mapSet = function mapSet (req, res, next, body) {
  Map.mapSet(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

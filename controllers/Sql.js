'use strict';

var utils = require('../utils/writer.js');
var Sql = require('../service/SqlService');

module.exports.sqlClose = function sqlClose (req, res, next, body) {
  Sql.sqlClose(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.sqlColumnTypes = function sqlColumnTypes (req, res, next) {
  Sql.sqlColumnTypes()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.sqlExecute = function sqlExecute (req, res, next, body) {
  Sql.sqlExecute(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.sqlFetchRows = function sqlFetchRows (req, res, next, body) {
  Sql.sqlFetchRows(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

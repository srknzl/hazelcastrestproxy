'use strict';

const ClientUtil = require('../utils/client');
const ErrorUtil = require('../utils/error');

const ongoingQueries = new Map();

/**
 * Closes an SQL result.
 * Given an SQL query id, this API will close an SQL result which releases its resources and becomes unusable afterwards.
 *
 * body Sql_close_body SQL query id of the SQL result to be closed.
 * no response value expected for this operation
 **/
exports.sqlClose = function(body) {
  return new Promise(function(resolve, reject) {
    const queryId = body.sqlQueryId;
    const sqlResult = ongoingQueries.get(queryId);
    sqlResult.close().then(() => {
      ongoingQueries.delete(queryId);
      resolve();
    }).catch(err => {
      reject(ErrorUtil.errorToJson(err));
    });
  });
}


/**
 * Returns the column types.
 * Returns the column type strings.
 *
 * returns List
 **/
exports.sqlColumnTypes = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ "VARCHAR", "BOOLEAN", "TINYINT", "SMALLINT", "INTEGER", "BIGINT", "DECIMAL", "REAL", "DOUBLE", "DATE", "TIME", "TIMESTAMP", "TIMESTAMP_WITH_TIME_ZONE", "OBJECT", "NULL", "JSON" ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Executes an SQL statement
 * Given an SQL statement, its parameters and options, execute the SQL statement. All rows will be accumulated and returned in an sqlResult. The returned sqlResult will include the first page of SQL rows. In order to fetch other page or close the SQL statement, you can use the sqlQueryId that will be returned as a response.
 *
 * body Object SQL string, parameters and statement options
 * returns inline_response_200_1
 **/
exports.sqlExecute = function(body) {
  return new Promise(function(resolve, reject) {  
    ClientUtil.getClient().then(client => {
      client.getSql().execute(body.sql, body.params ? body.params : undefined, body.options ? body.options : undefined).then(sqlResult => {
        ongoingQueries.set(sqlResult.queryId, sqlResult);
        const isRowSet = sqlResult.isRowSet();
        resolve({
          sqlQueryId: sqlResult.queryId,
          rows: isRowSet ? [...sqlResult] : null,
          rowMetadata: sqlResult.rowMetadata,
          updateCount: sqlResult.updateCount,
          isRowSet,
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
 * Fetches some more rows of an SQL result.
 * Given an SQL query id, this API will return you more rows of the SQL result if it is not exhausted already.
 *
 * body Sql_fetchRows_body SQL query id and number of rows you want to read.
 * returns inline_response_200_2
 **/
exports.sqlFetchRows = function(body) {
  return new Promise(async function(resolve, reject) {
    const queryId = body.sqlQueryId;
    const numberOfRowsToRead = body.numberOfRowsToRead;
    const sqlResult = ongoingQueries.get(queryId);
    let readRowCount = 0;
    const rows = [];
    try {
      for await (const row of sqlResult) {
        rows.push(row);
        readRowCount++;
        if (readRowCount === numberOfRowsToRead) {
          break;
        }
      }
    } catch (err) {
      reject(ErrorUtil.errorToJson(err));
    }
    let eof = false;
    if (readRowCount < numberOfRowsToRead) {
      eof = true;
    }
    // Query is closed because rows are ended.
    if (eof) {
      ongoingQueries.delete(queryId);
    }
    resolve({
      rows,
      eof,
      readRowCount
    });
  });
}


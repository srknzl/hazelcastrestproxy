'use strict';

const ClientUtil = require('../utils/client');
const ErrorUtil = require('../utils/error');
const QueryIdUtil = require('../utils/queryId');

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
    if(sqlResult === undefined) {
      reject({
        code: 404,
        payload: {
          message: `SQL result with query id ${queryId} is not found`,
        }
      });
      return;
    }
    sqlResult.close().then(() => {
      ongoingQueries.delete(queryId);
      resolve();
    }).catch(err => {
      reject(ErrorUtil.errorToJson(err));
    });
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
      client.getSql().execute(body.sql, body.params ? body.params : undefined, body.options ? body.options : undefined).then(async sqlResult => {
        const queryId = QueryIdUtil.queryIdToString(sqlResult.queryId);
        ongoingQueries.set(queryId, sqlResult);
        const isRowSet = sqlResult.isRowSet();

        const pageSize = sqlResult.cursorBufferSize;
        let rows = null;
        if(isRowSet) {
          rows = [];
          let counter = 0;
        
          for await (const row of sqlResult) {
            rows.push(row);
            counter++;
            if (counter === pageSize) {
              break;
            }
          }
        }
        
        resolve({
          sqlQueryId: queryId,
          rowMetadata: {columns: sqlResult.rowMetadata.columns},
          updateCount: sqlResult.updateCount,
          rows,
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
    if (sqlResult === undefined) {
      reject({
        code: 404,
        payload: {
          message: `SQL result with query id ${queryId} is not found`,
        }
      });
      return;
    }
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


'use strict';

exports.queryIdToString = function(queryId) {
    return [
        [queryId.memberIdHigh.low, queryId.memberIdHigh.high].join(';'),
        [queryId.memberIdLow.low, queryId.memberIdLow.high].join(';'),
        [queryId.localIdHigh.low, queryId.localIdHigh.high].join(';'),
        [queryId.localIdLow.low, queryId.localIdLow.high].join(';')
    ].join(',');
};

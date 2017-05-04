'use strict';

const properties = require ("properties");

module.exports = function (authFile) {
    return new Promise(function(resolve, reject) {
        properties.parse(authFile, { path: true }, function (err, props) {
            if (err) {
                reject(err);
            } else {
                resolve(props);
            }
        });
    });
};

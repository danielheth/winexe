'use strict';

const fs = require('fs');

module.exports = function (authFile) {
    var contents = fs.readFileSync(authFile, 'utf8');
    var lines = contents.split('\n');

    var props = {};
    lines.forEach(function(line) {
        var ln = line.trim();
        if (ln.indexOf('#') !== 0 && ln.indexOf('=') > 0) {
            var l = ln.split('=');
            props[l[0]] = l[1];
        }
    });

    return props;
};

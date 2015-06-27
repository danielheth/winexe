'use strict';

var spawn = require('child_process').spawn;
var path = require('path');

var getUsername = require('./username.js');

function WinExe(options) {
    this.host = options.host;
    this.username = getUsername(options.username);
    this.password = options.password;
    this.isWindows = process.platform === 'win32';
    this.winexe = this.isWindows ? 'psexec.exe' : 'winexe';

    return this;
}

WinExe.prototype._getArgs = function () {
    return this.isWindows ? this._getArgsForPsExec() : this._getArgsForWinExe();
};

WinExe.prototype._getArgsForWinExe = function () {
    var args = [];

    if (this.username) {
        if (this.password) {
            args.push('--user=' + this.username + '%' + this.password);
        } else {
            args.push('--user=' + this.username);
        }
    }

    if (!this.password) {
        args.push('--no-pass');
    }

    args.push('//' + this.host, this.cmd);

    return args;
};

WinExe.prototype._getArgsForPsExec = function () {
    var args = [
        '\\\\' + this.host
    ];

    if (this.username) {
        args.push('-u', this.username);
    }

    if (this.password) {
        args.push('-p', this.password);
    }

    args.push('-accepteula');

    args = args.concat(this.cmd.split(' '));

    return args;
};

WinExe.prototype._exec = function (callback) {
    var cp = spawn(this.winexe, this._getArgs(), {
        cwd: path.join(__dirname, '..'),
        stdio: ['ignore', 'pipe', 'pipe']
    });

    var stdout = '';

    cp.stdout.on('data', function (data) {
        stdout += data;
    });

    var stderr = '';

    cp.stderr.on('data', function (data) {
        stderr += data;
    });

    cp.on('close', function (code) {
        if (code !== 0) {
            callback(new Error('Exit code: ' + code + '. ' + stderr.trim()));
        } else {
            callback(null, stdout, stderr);
        }
    });
};

WinExe.prototype.run = function (cmd, callback) {
    this.cmd = cmd;

    if (typeof callback === 'function') {
        this._exec(callback);
    }

    return this;
};

module.exports = WinExe;
# winexe
Wrapper around the winexe and psexec|paexec

### Install
```bash
npm install winexe
```

### Usage
```javascript
var WinExe = require('winexe');

var winexe = new WinExe({
    username: 'LOGIN',
    password: 'PASSWORD',
    host: 'IP-ADDRESS',
    timeout: 60000 // optional timeout in ms, winexe process will be killed with SIGKILL
});

// Run command on remote host
winexe.run('cmd.exe /c ipconfig /all', function (err, stdout, stderr) {
    // console.log(stdout);
});
```


### Secure Usage
```javascript
var WinExe = require('winexe');

//write out creds to disk
var authFile = path.join(__dirname, './auth');
fs.writeFileSync(authFile, `username=LOGIN\npassword=PASSWORD\n`);

var winexe = new WinExe({
    'authentication-file': authFile,  //after use, the auth file will automatically be deleted
    host: 'IP-ADDRESS',
    timeout: 60000 // optional timeout in ms, winexe process will be killed with SIGKILL
});

// Run command on remote host
winexe.run('cmd.exe /c ipconfig /all', function (err, stdout, stderr) {
    // console.log(stdout);
});
```

Note:  On Windows the username is passed on the command line, however the password is safely passed in via file.


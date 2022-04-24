# How to package BKC Node

## 1- Part1
```e1
npm install -g pkg
```
### create pkg.json file
```e2
{

"bin": {
    "blocklychainapp": "/home/bkc-node/app.js"
  },

"pkg": {
  "scripts": [],
  "assets": [
    "./node_modules/vm2/lib/setup-sandbox.js",
    "./node_modules/express-status-monitor/src/public/stylesheets/default.css",
    "./config/iabroker.certificate.key",
    "./config/iabroker.certificate.crt",
    "./public/**/*",
    "./views/**/*",
    "./node_modules/vm2/lib/contextify.js",
    "./node_modules/vm2/lib/sandbox.js"
  ],
  "targets": [
    "node16-linux-x64"
  ],
  "outputPath": "pkg"
}
}

```
### create pkg folder
```e2
# create a folder "config" in "pkg" folder
# copy these files "fingerprint.json" , "mailconf.json" in config folder
# copy certificates files "webprivate.pem" , "webpublic.pem" in config folder
# copy "public" folder in "pkg" folder
$ cd home/bkc-node/
$ cp -R public pkg
```

## 2- Part2
### Type this command
```e3
$ pkg -c pkg.json bin/iabroker-server
```




# How to install a bkc-node on a Ubuntu 20

## 1- Install MongoDB
### Step 1 — Installing MongoDB

```mongo
$ curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
```
```mongo
$ apt-key list
```
```mongo
$ echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
```
```mongo
$ sudo apt update
```
```mongo
$ sudo apt install -y mongodb-org
```
### Step 2 — Starting the MongoDB Service and Testing the Database
```mongotest
$ sudo systemctl start mongod.service
```
```mongotest
$ sudo systemctl status mongod
```
```mongotest
$ sudo systemctl enable mongod
```

### Step 3 — Managing the MongoDB Service (If you need, not necessary)
```mongot
$ sudo systemctl status mongod
$ sudo systemctl stop mongod
$ sudo systemctl start mongod
$ sudo systemctl restart mongod
$ sudo systemctl disable mongod
$ sudo systemctl enable mongod
```
## 2-Copy BKC Node databases (iabroker and iasystem)
folders on your server (They are already on the emptyDB folder). Then, using the following commands import the empty databses to your Mongodb. These folders are availeb on project GitHub. 
(Intenral note, "$ mongodump" command can be used to export an existing Monogdb database.)
```db
$ sudo mongorestore --db iabroker --drop /root/db-dump/iabroker
```
```db
$ sudo mongorestore --db iabroker --drop /root/db-dump/iasystem
```
note: If you need unzip your files, you can use these commands:
```zip
$ sudo apt install unzip
$ unzip <your file>.zip
```
## 3- Install Node.js v11.x
```node
$ cd ~
```
```node
$ curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
```
```node
$ sudo apt install nodejs
```
```node
$ node -v
```
## 4- Clone the BKC Node source files.
```clone
$ git clone https://XXXXXXXXXX@github.com/gramezan/bkc-node-source-development.git
```
```clone
$ cd home/bkc-node-source-development

```
```clone
$ sudo npm install -g node-gyp@3.8.0
```
```clone
$ sudo npm install
```
```clone
$ sudo npm install jsonschema@1.2.6
```

## 5- Install pm2 
(see: https://www.tecmint.com/install-pm2-to-run-nodejs-apps-on-linux-server/ )
```pm2
$ sudo npm install -g pm2
```


## 6- Install nginx web server 
https://phoenixnap.com/kb/how-to-install-nginx-on-ubuntu-20-04  or https://www.linuxcapable.com/how-to-install-nginx-with-lets-encrypt-tls-ssl-on-ubuntu-20-04/

```nginx
$ sudo apt update
```
```nginx
$ sudo apt -y install nginx
```
```nginx
$ systemctl status nginx
```

### Update the nginx.conf in /etc/nginx/nginx.config

```codenginx

user www-data;
worker_processes auto;
pid /run/nginx.pid;
# include /etc/nginx/modules-enabled/*.conf;

events {
	worker_connections 1024;
	# multi_accept on;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    # keepalive_timeout   6000;
    # types_hash_max_size 2048;
    client_max_body_size 100M;


    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;



    server {
        gzip on;
        listen 80;
    
        server_name  _;
        root         /usr/share/nginx/html;
	ssl_certificate  ssl/webpublic.pem;
	ssl_certificate_key ssl/webprivate.pem;
	server_name  cl.blocklychain.io;    
        return 301 https://$host$request_uri;
    }
	

       server {
	      gzip on;
              listen       443 ssl;
	  
              ssl_certificate  ssl/webpublic.pem;
	      ssl_certificate_key ssl/webprivate.pem;

       #This line for iavoice controller to forward /webhook_google to port 9122
       location /webhook {
          proxy_pass http://localhost:9122;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection 'upgrade';
		proxy_set_header Host $host;
		proxy_cache_bypass $http_upgrade;
		
		add_header "Pragma" "no-cache";
		add_header "Expires" "-1";
		add_header Last-Modified $date_gmt;
                add_header Cache-Control 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
                if_modified_since off;
                expires off;
                etag off;
       }


       #This line for iavoice controller to forward /webhook_alexa to port 9122
       location /webhook_alexa {
          proxy_set_header   X-Forwarded-For $remote_addr;
          proxy_set_header   Host $http_host;
          proxy_pass         "http://127.0.0.1:9122";
       }


	   location / {
		proxy_pass http://localhost:50500;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection 'upgrade';
		proxy_set_header Host $host;
		proxy_cache_bypass $http_upgrade;
		
		add_header "Pragma" "no-cache";
		add_header "Expires" "-1";
		add_header Last-Modified $date_gmt;
                add_header Cache-Control 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
                if_modified_since off;
                expires off;
                etag off;
	    }

           }

}

```

## 7- Https Certificate
### Installing Certbot:
```cert
$ sudo add-apt-repository ppa:certbot/certbot
```
```cert
$ sudo apt-get update
```
```cert
$ sudo apt-get install certbot
```
```cert
$ certbot certonly --standalone --preferred-challenges http -d cl.blocklychain.io
```
### Converting Certificates (If you need, not necessary):
```convert
$ openssl x509 -outform der -in webpublic.pem -out webpublic.crt
$ openssl rsa -outform der -in webprivate.pem -out webprivate.key
$ openssl rsa -outform der -in iabroker.certificate.key -out iabroker.certificateKey.pem
$ openssl x509 -outform der -in iabroker.certificate.crt -out iabroker.certificate.pem
```

## 8-Config your BKC Node

### Step 1- create config/which.config.js and Update

```s1
# Replace your fingerprint
module.exports.fingerprint = 'FB:63:86:B4:94:13:15:77:5D:BE:6A:FE:68:61:FB:E2:D8:AF:E1:F0';
```
### Step 2- create config/email.config.js and Update

```s2
# Replace your email info
host: 'mail.bkcnode.com',
port: 587,
auth: {
       user: 'mailto:panel@bkcnode.io',
       pass: 'Hello123'
},
```

### Step 3- put these files in following directory

```s3
config/webprivate.pem
config/webprivate.key
config/webpublic.pem
config/webpublic.crt
config/iabroker.certificate.key
config/iabroker.certificate.crt	
```

### Step 4- create public/share/js/config/configs.js and Update

```s4
# Replace your info
var fingerprint = '<YOUR FINGERPRINT>'
var domainUrl = 'https://<YOUR DOMAIN>';
var brokerUrl = 'mqtts://<YOUR DOMAIN>:3008'; //secure https or wss
var domainName = 'Blocklychain';
```
### Step 5- Update images
  
  in library/front-end/resources/images make a copy of logo-bkcnode.png and save it with the name logo-your_domain_name_without_extension.png
	and make a copy of logo-h-bkcnode.png and save it with the name logo-h-your_domain_name_without_extension.png
  edit two lines of .gitignore file and replace cpvanda with your domain name without extension as follows:
  
```s5
library/front-end/resources/images/logo-cpvanda.png
library/front-end/resources/images/logo-h-cpvanda.png
```

## 9- Run your BKC Node
in the root folder of project run the program:
```run
$ node app-launcher.js
```
OR
```run
$ pm2 start pm2-launcher.json
```




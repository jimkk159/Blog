#!/bin/bash

#give permission
sudo chmod -R 777 /home/ec2-user/Blog

#to app folder
cd /home/ec2-user/Blog/backend

#install node modules
npm install

#start our node app in the background
node server.js > server.out.log 2> server.err.log < /dev/null & 
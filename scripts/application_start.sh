#!/bin/bash

#give permission
sudo chmod -R 777 /home/ec2-user/Blog

#copy the .env
cp /home/ec2-user/.env /home/ec2-user/Blog/backend/.env

#change work dir
cd /home/ec2-user/Blog/backend

#add npm and node to path
export NVM_DIR="$HOME/.nvm"	
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm	
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in path now)

#install node modules
npm install

#start our node app in the background
node server.js > server.out.log 2> server.err.log < /dev/null & 
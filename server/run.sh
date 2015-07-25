#!/bin/bash
pushd `dirname $0` > /dev/null

BASE_DIR=`pwd`
cd $BASE_DIR

npm install
npm install forever -g

chmod +x *
ls -ltr 


echo "****** Application is bootstrapping ..... **********"
#forever start img_processor_server.js 
nodejs img_processor_server.js


# returning to the base directory
popd > /dev/null

echo "Stopped nodejs server"






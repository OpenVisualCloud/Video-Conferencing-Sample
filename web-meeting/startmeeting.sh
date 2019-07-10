#!/usr/bin/env bash
#
#/**
# * License placeholder.
# */
#
this=`dirname "$0"`
this=`cd "$this"; pwd`
ROOT=`cd "${this}/.."; pwd`
export CONFIG_HOME=/home/web-meeting/
sleep 5
dburl=localhost/owtdb

node initdb.js ${dburl} > /home/service

cat /home/service  

SAMPLESERVID=`grep -E 'sampleServiceId:' /home/service | awk '{print $2}'`
SAMPLESERVKEY=`grep -E 'sampleServiceKey:' /home/service | awk '{print $2}'`
OWTSERVER=`grep -E 'ip:' /home/service | awk '{print $2}'`

echo $SAMPLESERVID
echo $SAMPLESERVKEY
echo $OWTSERVER

sed -i "s#_auto_generated_SAMPLE_ID_#${SAMPLESERVID}#" ${CONFIG_HOME}/config.js
sed -i "s#_auto_generated_SAMPLE_KEY_#${SAMPLESERVKEY}#" ${CONFIG_HOME}/config.js
#sed -i "s#localhost#${OWTSERVER}#" ${CONFIG_HOME}/config.js

/home/self-sign.sh $(hostname -i) ${CONFIG_HOME}/cert
cd ${CONFIG_HOME}
node meetingserver.js

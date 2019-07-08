#!/bin/bash -e

sed -i "s#127.0.0.1#0.0.0.0#" /etc/mongodb.conf &
service mongodb start &
service rabbitmq-server start &
while ! mongo --quiet --eval \"db.adminCommand('listDatabases')\"
do
    sleep 1
done

if [ -n "$1" ]; then
echo $1
repacestr="network_interfaces = [{name = \"eth0\", replaced_ip_address = \"${$1}\"}]"

sed -i "s/network_interfaces = \[\]/${repacestr}/" webrtc_agent/agent.toml
sed -i "/^ip_address = /c \ip_address = \"${$1}\"" portal/portal.toml
fi

cd /home/owt
./management_api/init.sh && ./bin/start-all.sh 
sleep infinity

#!/bin/bash -e

sed -i "s#127.0.0.1#0.0.0.0#" /etc/mongodb.conf &
service mongodb start &
service rabbitmq-server start &
while ! mongo --quiet --eval "db.adminCommand('listDatabases')"
do
    sleep 1
done


if [ -n "$1" ]; then

# format the parameters
set -- $(getopt -u -l ip:,eth:,openh264:,network_interface:: -- -- "$@")
# get the parameters
while [ -n "$1" ]
do
    case "$1" in
        --ip ) externalip=$2; shift; shift ;;
        --eth ) eth=$2; shift; shift ;;
        * ) break;;
    esac
done

repacestr="network_interfaces = [{name = \"${eth}\", replaced_ip_address = \"${externalip}\"}]"

sed -i "s/network_interfaces = \[\]/${repacestr}/" /home/owt/webrtc_agent/agent.toml
sed -i "/^ip_address = /c \ip_address = \"${externalip}\"" /home/owt/portal/portal.toml
fi

cd /home/owt
./management_api/init.sh && ./bin/start-all.sh 
sleep infinity

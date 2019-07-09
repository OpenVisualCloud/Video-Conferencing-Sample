#!/bin/bash

DIR=$(dirname $(readlink -f "$0"))

hostname=$1
directory=$2

if [ ! -d "$directory" ]; then
    mkdir ${directory}
fi

openssl req -x509 -nodes -days 180 -newkey rsa:2048 -keyout ${directory}/key.pem -out ${directory}/cert.pem << EOL
CN
SH
Shanghai
Shanghai
owt-demo
${hostname}
nobody@owt.org
EOL

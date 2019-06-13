#!/bin/bash -e

DIR=$(dirname $(readlink -f "$0"))
echo $DIR
export SERVICE_VOLUME="../volume/owt-service"

sudo docker container prune -f
sudo docker volume prune -f
sudo docker network prune -f
sudo rm -rf "${SERVICE_VOLUME}"
sudo mkdir -p "${SERVICE_VOLUME}"

yml="$DIR/docker-compose.$(hostname).yml"
test -f "$yml" || yml="$DIR/docker-compose.yml"

case "$1" in
docker_compose)
    dcv="$(docker-compose --version | cut -f3 -d' ' | cut -f1 -d',')"
    mdcv="$(printf '%s\n' $dcv 1.20 | sort -r -V | head -n 1)"
    if test "$mdcv" = "1.20"; then
        echo ""
        echo "docker-compose >=1.20 is required."
        echo "Please upgrade docker-compose at https://docs.docker.com/compose/install."
        echo ""
        exit 0
    fi

    export USER_ID=$(id -u)
    export GROUP_ID=$(id -g)
    sudo -E docker-compose -f "$yml" -p webmeeting --compatibility up
    ;;
*)

    export USER_ID=$(id -u)
    export GROUP_ID=$(id -g)
    sudo -E docker stack deploy -c "$yml" webmeeting
    ;;
esac

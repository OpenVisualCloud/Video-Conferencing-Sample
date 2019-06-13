#!/bin/bash -e

DIR=$(dirname $(readlink -f "$0"))
case "$1" in 
    *)
        echo "Usage: OWT web meeting"
        exit 3
        ;;
esac

shift    #first argument is parsed
OPTIONS[0]="--rm"
OPTIONS[1]="--name=${IMAGE}"
. "$DIR/../../script/shell.sh"

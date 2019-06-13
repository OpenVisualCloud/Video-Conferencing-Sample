
FROM ubuntu:18.04 AS build
WORKDIR /home

# Install node
ARG NODE_VER=v8.15.0
ARG NODE_REPO=https://nodejs.org/dist/${NODE_VER}/node-${NODE_VER}-linux-x64.tar.xz

RUN apt-get update && apt-get install -y -q --no-install-recommends ca-certificates wget xz-utils libssl-dev curl

RUN wget ${NODE_REPO} && \
    tar xf node-${NODE_VER}-linux-x64.tar.xz && \
    cp node-*/* /usr/ -rf && rm -rf node-*

COPY ./app_server/* /home/web-meeting/

COPY ./self-sign.sh /home/
COPY ./html /home/web-meeting/html


RUN cd /home/web-meeting && npm install
COPY ./initdb.js /home/
COPY ./cipher.js /home/
COPY ./package.json /home/

RUN cd /home && npm install

COPY ./startmeeting.sh /home/
CMD  ["/bin/bash","-c","/home/startmeeting.sh"]






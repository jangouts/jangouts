#!/usr/bin/env bash

if [ ! -f /etc/janus/cert.pem ]
then
  /usr/bin/openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/janus/cert.key -out /etc/janus/cert.pem \
    -subj "/C=DE/CN=jangouts.local"
fi

exec "$@"

#!/bin/bash
# This is a quick and dirty script to setup an openSUSE based development
# environment form Jangouts and it's intended to be used by Vagrant when
# setting up the machine.

set -x

#
# Installing Janus Gateway. This will take a while..."
#
sudo zypper ar -f --no-gpgcheck -r http://download.opensuse.org/repositories/network:/jangouts/openSUSE_Leap_42.1/network:jangouts.repo
sudo zypper -n in -t pattern devel_C_C++
sudo zypper -n in janus-gateway

#
# Generating self-signed certificate for Janus Gateway
#
if [ ! -f /etc/janus/cert.pem ]
then
  sudo openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/janus/cert.key -out /etc/janus/cert.pem \
    -subj "/C=DE/ST=/L=/O=/CN=jangouts.local"
fi

#
# Starting Janus service
#
sudo systemctl start janus.service
sudo systemctl enable janus.service

#
# Installing Jangouts development requirements
#
sudo zypper -n in git

if [ ! -d /home/vagrant/.nvm ]
then
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh | bash
  source ~/.nvm/nvm.sh
  nvm install 5
  nvm alias default 5
  npm install -g bower
  npm install -g yarn
fi

#
# Install NPM packages.
#
[[ ! -d node_modules ]] && mkdir node_modules
cd /home/vagrant/jangouts
[[ ! -L node_modules ]] && ln -s ../node_modules
yarn install

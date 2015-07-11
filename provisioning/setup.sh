#!/bin/bash
# This is a quick and dirty script to setup an openSUSE based development
# environment form Jangouts and it's intended to be used by Vagrant when
# setting up the machine.

set -x

#
# Installing Janus Gateway. This will take a while..."
#
sudo zypper ar -f --no-gpgcheck -r http://download.opensuse.org/repositories/home:/mlin7442:/hackweek11/openSUSE_13.2/home:mlin7442:hackweek11.repo
# FIXME: we need this because of a conflict with libnice.
sudo zypper -n remove patterns-openSUSE-minimal_base-conflicts
sudo zypper -n in janus-gateway

#
# Generating self-signed certificate for Janus Gateway
#
if [ ! -f /usr/share/janus/certs/mycert.pem ]
then
  sudo openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 \
    -keyout /usr/share/janus/certs/mycert.key \
    -out /usr/share/janus/certs/mycert.pem -subj "/C=DE/ST=/L=/O=/CN=jangouts.local"
fi

#
# Starting Janus service
#
sudo systemctl start janus.service
sudo systemctl enable janus.service

#
# Installing Janguts requirements
#
sudo zypper -n in git
# FIXME: in the future, packages for openSUSE should be used.
if [ ! -d /home/vagrant/.nvm ]
then
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | bash
  source ~/.nvm/nvm.sh
  nvm install stable
  nvm alias default stable
  npm install -g bower gulp
fi

#
# Install NPM and Bower packages.
#
[[ ! -d node_modules ]] && mkdir node_modules
cd /home/vagrant/jangouts
[[ ! -L node_modules ]] && ln -s ../node_modules
npm install && bower install

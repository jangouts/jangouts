# Running Janus Gateway

To use Jangouts, you need a [Janus Gateway](https://janus.conf.meetecho.com/) server to handle the
WebRTC traffic. After all, Jangouts is _just_ a user interface on top of Janus.

## Option 1: Docker

You can run Janus using [Docker](https://www.docker.com/). This repository includes the required
configuration files to set up the Janus server using [Docker
Compose](https://docs.docker.com/compose/). After installing *docker-compose*, run:

    docker-compose up
    
Grab a coffee and wait for the service to be available.

## Option 2: Install Janus Gateway from Packages

If your Linux distribution offers up-to-date packages (at least version 1.0), you can use them. For
most Linux distributions that implies installing the `janus` or `janus-gateway` package. Make sure
those packages include data channels support.

Janus is part of the official distribution in both openSUSE Tumbleweed and Debian Testing. For other
(open)SUSE distributions, a proper package can be easily found at
[software.opensuse.org](https://software.opensuse.org/package/janus-gateway) and installed using
1-Click Install. For Snap-based distributions like Ubuntu, Janus Gateway is also [available at
snapcraft](https://snapcraft.io/janus-gateway).

For security reasons, the (open)SUSE package does not include the SSL certificates shipped by
default with Janus Gateway. To generate a self-signed certificate, use OpenSSL:

```sh
cd /usr/share/janus/certs
sudo openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 \
  -keyout mycert.key -out mycert.pem
```

In (open)SUSE, the gateway can be then started (after adjusting the list of
rooms at ```/etc/janus/janus.plugin.videoroom.cfg``` if desired) with the
command:

```sh
sudo systemctl start janus.service
sudo systemctl enable janus.service # to start it also after reboot
```

## Option 3: Compile Janus Gateways

Compiling Janus Gateway from the sources is, of course, also an option. Check the Janus [project
page](https://github.com/meetecho/janus-gateway) at Github for instructions.

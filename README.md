# Yojume
theme base : https://bootswatch.com/lux/
## library : 
animate-scss https://github.com/geoffgraham/animate.scss

# Jangouts

Jangouts (for "Janus Hangouts") is a solution for videoconferencing based
on WebRTC and the excellent [Janus Gateway](http://janus.conf.meetecho.com/)
with a user interface loosely inspired by Google Hangouts. It aims to provide
a completely self-hosted open source alternative to Google Hangouts and similar
solutions. Currently Jangouts supports conferences with video, audio, screen
sharing and textual chat organized into an unlimited amount of conference rooms
with a configurable limit of participants per room.

![Example screen of Jangouts 0.4.0](screenshot.png?raw=true)

## Installation

Jangouts is a JavaScript application running exclusively client-side (i.e. in
the browser). The server simply needs to provide a bunch of static files
through a web server.

### Step 1. Janus Gateway

All the server-side WebRTC handling is performed by Janus Gateway, so the first
requirement is a running janus server with support for data channels compiled
in, with the videoroom plugin enabled and with a valid list of rooms in the
`janus.plugin.videoroom.cfg` file. For most Linux distributions that
translates into installing the `janus` or `janus-gateway` package.
Make sure those packages include data channels support. Compiling Janus Gateway
from the sources is, of course, also an option.

For (open)SUSE distributions, a proper package can be easily found at
[software.opensuse.org](https://software.opensuse.org/package/janus-gateway) and
installed using 1 Click Install.

For security reasons, the (open)SUSE package does not include the SSL
certificates shipped by default with Janus Gateway. To generate a self-signed
certificate, use OpenSSL:

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

### Step 2. Download and configure Jangouts

The easiest way to get Jangouts is to download the latest archive from the
[Jangouts releases page at Github](https://github.com/jangouts/jangouts/releases).
For deployment purposes, the only relevant directory in that archive is
the one called `dist`, which contains the files to be served by the HTTP
server to the participants' browsers. That includes the file called
`config.json` that can be tweaked to point the participants to any Janus
server, to enable extra debugging, etc. The file already contains sensible
defaults that should work out of the box for most cases. It's fine to have some
configuration parameters set to `null` in that file, Jangouts will try to guess
the proper value during runtime.

If some Jangouts plugin is activated, it may need additional configuration in a
separate file. See the corresponding section below.

### Step 3. Serve the `dist` folder

Given than a Janus Gateway server is running and reachable and that
`config.json` contains the proper values (usually just the default ones), all
that needs to be done is to serve the content of the `dist` directory to the
clients. Any web server, such as Apache, can be used for that purpose.

The simplest way (although not the cleanest) to do such thing in an (open)SUSE
system would be:

1. `sudo zypper in apache2`
2. Copy the content of `dist` directly into `/srv/www/htdocs/`
3. `sudo systemctl start apache2.service`

See the [deployment instructions](DEPLOYMENT.md) for more information about how
to properly configure Apache.

## Plugins

Jangouts includes limited support for plugins in order to provide additional
functionality. At the time of writing, the only available plugin provides
integration with [Callstats.io](https://www.callstats.io/), a propietary
third-party service to analyze WebRTC traffic and diagnose potential problems.
In order to enable this plugin, write your credentials in a
`config.callstats.json` file (following the syntax in
`config.callstats.json.sample`) and set the following value in `config.json`.

```
enabledPlugins: ["callstats"]
```

If "callstats" is not listed in the list of enabled plugins, Jangouts will not
include, download or execute any code coming from Callstats.io and will not
connect to the Callstats.io servers in any other form.

## A note about security and browsers

Browsers will refuse to allow screen sharing through WebRTC for connections not
using SSL. In some cases, they will even refuse to send any WebRTC content
at all, neither video or audio. Thus, to allow users of your Jangouts instance
to use the screen sharing functionality (or, in some cases, to use Jangouts at
all) you will have to provide HTTPS access to both the files and the Janus
gateway, like shown in the [deployment instructions](DEPLOYMENT.md).

## Troubleshooting

If Jangouts does not work, please check the
[troubleshooting guide](TROUBLES.md).

## Developing Jangouts

In order to modify Jangouts, it's necessary to install some development tools.
That setup is detailed in the [development instructions](DEVELOPMENT.md).

## Acknowledgments

* [Janus Gateway](http://janus.conf.meetecho.com/) developers, for such a
powerful and versatile tool.
* [SUSE Linux](http://www.suse.com), for the awesome
[Hackweek](http://hackweek.suse.com) initiative.

## License

This software is released under the terms of the MIT License. See the
[license file](LICENSE.txt) for more information.

## Find us

Jangouts developers can be usually found at:
 - [#jangouts IRC channel at Freenode](https://webchat.freenode.net/?channels=%23jangouts)
 - [Google Groups](https://groups.google.com/forum/#!forum/jangouts)

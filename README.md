# Jangouts

[![Coverage Status](https://coveralls.io/repos/github/jangouts/jangouts/badge.svg?branch=master)](https://coveralls.io/github/jangouts/jangouts?branch=master)

Jangouts (for "Janus Hangouts") is a solution for videoconferencing based on WebRTC and the
excellent [Janus Gateway](http://janus.conf.meetecho.com/) with a user interface loosely inspired by
Google Hangouts. It aims to provide a completely self-hosted open source alternative to Google
Hangouts and similar solutions. Currently Jangouts supports conferences with video, audio, screen
sharing and textual chat organized into an unlimited amount of conference rooms with a configurable
limit of participants per room.

![Example screen of Jangouts 0.4.0](screenshot.png?raw=true)

## Installation

Jangouts is a JavaScript application running exclusively client-side (i.e. in the browser). The
server simply needs to provide a bunch of static files through a web server.

### Step 1. Janus Gateway

All the server-side WebRTC handling is performed by Janus Gateway, so the first requirement is a
running janus server with support for data channels compiled in, with the videoroom plugin enabled
and with a valid list of rooms in the `janus.plugin.videoroom.cfg` file. 

There are many ways to get a Janus Gateway server running in your system. Check [JANUS.md](JANUS.md)
for some guidance.

### Step 2. Download and configure Jangouts

The easiest way to get Jangouts is to download the latest archive from the [Jangouts releases page
at Github](https://github.com/jangouts/jangouts/releases).  For deployment purposes, the only
relevant directory in that archive is the one called `build`, which contains the files to be served
by the HTTP server to the participants' browsers.

A file called `config.json` can be added to that directory to point the participants to any Janus
server, to enable extra debugging, or to tweak Jangouts in several ways. Use the file
`config.sample.json` as starting point. It's fine to operate Jangouts without a `config.json` file
or to have some parameters set to `null` in that file, Jangouts will try to guess the proper value
during runtime.

### Step 3. Serve the `build` folder

Given than a Janus Gateway server is running and reachable and that `config.json` contains the
proper values (in case something needs to be adjusted), all that needs to be done is to serve the
content of the `build` directory to the clients. Any web server, such as Apache, can be used for
that purpose.

The simplest way (although certainly not the cleanest) to do such thing in an (open)SUSE
system would be:

1. `sudo zypper in apache2`
2. Copy the content of `build` directly into `/srv/www/htdocs/`
3. `sudo systemctl start apache2.service`

Done. At that point you should be able to access your own instance of Jangouts just by pointing your
browser to `http://localhost/`.

See the [deployment instructions](DEPLOYMENT.md) for more information about how to properly
configure Apache.

## A note about security and browsers

Browsers will refuse to allow screen sharing through WebRTC for connections not using SSL. In most
cases, they will even refuse to send any WebRTC content at all, neither video or audio. Providing
HTTPS access to both the files and the Janus gateway, like shown in the [deployment
instructions](DEPLOYMENT.md), may be crucial for a proper usage experience.

## Plugins

Jangouts includes limited support for plugins in order to provide additional functionality. But
plugins are temporarily disabled in the current version of Jangouts. If you are interested on
Jangouts plugins, use Jangouts version 0.5.x for the time being. Information about configuring the
existing plugins is found in the README.md file for that release.

## Troubleshooting

If Jangouts does not work, please check the [troubleshooting guide](TROUBLES.md).

## Developing Jangouts

In order to modify Jangouts, it's necessary to install some development tools.
That setup is detailed in the [development instructions](DEVELOPMENT.md).

## Acknowledgments

* [Janus Gateway](http://janus.conf.meetecho.com/) developers, for such a powerful and
  versatile tool.
* [SUSE Linux](http://www.suse.com), for the awesome [Hack Week](http://hackweek.suse.com)
  initiative.

## License

This software is released under the terms of the MIT License. See the
[license file](LICENSE.txt) for more information.

## Find us

Jangouts developers can be usually found at:
 - [#jangouts IRC channel at Freenode](https://webchat.freenode.net/?channels=%23jangouts)
 - [Google Groups](https://groups.google.com/forum/#!forum/jangouts)

# Jangouts

Jangouts (for "Janus Hangouts") is a solution for videoconferencing based
on WebRTC and the excellent [Janus Gateway](http://janus.conf.meetecho.com/)
with a user interface heavily inspired by Google Hangouts. It aims to provide
a completely self-hosted open source alternative to Google Hangouts and similar
solutions. Currently Jangouts supports conferences with video, audio, screen
sharing and textual chat organized into an unlimited amount of conference rooms
with a configurable limit of participants per room.

## Installation

Jangouts is a JavaScript application running exclusively client-side (i.e. in
the browser). The server simply needs to provide a bunch of static files
through a web server.

The following set up is aimed to be used in development environment. If you
want to go to production, take a look at the [deployment
instructions](DEPLOYMENT.md). Anyway, it's strongly recommended to set up the
development environment to get in touch with Jangouts.

### Step 1. Janus Gateway

All the server-side WebRTC handling is performed by Janus Gateway, so the first
requirement is a running janus server with the videoroom plugin enabled and a
valid list of rooms in the ```janus.plugin.videoroom.cfg``` file. For most Linux
distributions that translates into installing the ```janus-gateway``` package.
For (open)SUSE distributions, the package can be easily found at
[software.opensuse.org](https://software.opensuse.org/package/janus-gateway) and
installed using 1 Click Install.

For security reasons, (open)SUSE package does not include SSL certificates
shipped by default with Janus Gateway. To generate a self-signed certificate,
you can use OpenSSL:

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

### Step 2. Configure Jangouts

The first step to configure Jangouts is to get a local copy of this repository:

```sh
git clone https://github.com/jangouts/jangouts
```

If git command not found, then please install git from you packager. For example, if you
are running (open)SUSE you could type:
```sh
sudo zypper in git
```

Then you could adapt the configuration by creating a file called
`src/app/config.local.json` overriding the default settings found in
`src/app/config.json`.

For a development environment, the next configuration would be fine:

```json
{
  "janusServer": "http://localhost:8088/janus"
}
```

### Step 3. Install requirements

In order to develop Jangouts, you need to install [Node.js](http://nodejs.org),
 [npm](http://npmjs.com), [Bower](http://bower.io)
and [Gulp.js](http://gulpjs.com).

Node.js and npm should be available in any Linux distribution. For example, if you’re
running (open)SUSE you could type:

```sh
sudo zypper in nodejs nodejs-npm
```

Take into account that, in some cases, npm is bundled in the same package as Node.js.

If you prefer, you could use [Node Version
Manager](https://github.com/creationix/nvm) to install Node.js and npm.

Now, you must install Bower and Gulp.js globally through npm. Just type:

```sh
sudo npm install -g bower gulp
```

### Step 4. Install dependencies

This project uses npm to manage development dependencies and Bower for runtime dependencies.
Those dependencies are defined in `package.json` and `bower.json` files. To install them,
just type:

```sh
npm install && bower install
```

Bear in mind that every time a new dependency is added, you must run this command again.

### Step 5. Start the webserver

If you only want to make some development, you don’t need to install any
webserver. Just type:

```sh
gulp serve
```

Now you should be able to access with your browser through the URL
`http://localhost:3000/`.

## A note about screen sharing

Browsers will refuse to allow screen sharing through WebRTC for
connections not using SSL. Thus, to allow users of your Jangouts
instance to use the screen sharing functionality you will have to
provide HTTPS access to both the files and the Janus gateway, like shown
in the [deployment instructions](DEPLOYMENT.md).

## Troubleshooting

When jangouts server do not work, there is wide variety of ways how to ways how to debug it.
Usually the easiest one is to use browser debug tools.

### unreachable janus
When error reported is something like _cannot establish connection to server at ws://.../janus_
then it indicate problem with janus. So check if janus is running with
```sudo systemctl status janus.service```. If it is failed, then check for possible reasons in
```journalctl --unit janus.service```.

## Acknowledgments

* [Janus Gateway](http://janus.conf.meetecho.com/)

## License

This software is released under the terms of the MIT License. See the
[license file](LICENSE.txt) for more information.

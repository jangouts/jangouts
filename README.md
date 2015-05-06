# Jangouts

Jangouts (for "Janus Hangouts") is a solution for videoconferencing based
on WebRTC and the excellent [Janus Gateway](http://janus.conf.meetecho.com/)
with a user interface heavily inspired by Google Hangouts. It aims to provides
a completely self-hosted open source alternative to Google Hangouts and similar
solutions. Currently Jangouts supports conferences with video, audio, screen
sharing and textual chat organized into an unlimited amount of conference rooms
with a configurable limit of participants per room.

## Installation

### Step 1. Janus Gateway

All the server-side WebRTC handling is performed by Janus Gateway, so the first
requirement is a running janus server with the videoroom plugin enabled and a
valid list of rooms in the ```janus.plugin.videoroom.cfg``` file. For most Linux
distributions that translates into installing the ```janus-gateway``` package.
For (open)SUSE distributions, the package can be easily found at
[software.opensuse.org](https://software.opensuse.org/package/janus-gateway) and
installed using 1 Click Install.

In (open)SUSE, the gateway can be then started (after adjusting the list of
rooms at ```/etc/janus/janus.plugin.videoroom.cfg``` if desired) with the
command:

```bash
systemctl start janus.service
```

### Step 2. Configure and compile Jangouts

Jangouts is a JavaScript application running exclusively client-side (i.e. in
the browser). The server simply needs to provide a bunch of static files through
a web server. [Gulp.js](http://gulpjs.com/) is used to generate those files.
More information about Gulp and other tools used during Jangouts development can
be found below in the corresponding section.

The first step to generate the files would be to get a local copy of this
repository:

```bash
git clone https://github.com/ancorgs/jangouts
```

Then you could adapt the configuration by creating a file called
```src/app/config.local.json``` overriding the default settings found in
```src/app/config.json```. Currently that's only necessary if you plan to make
the Janus server directly accessible to the clients, without your web server
acting as a proxy (see step 3 for a more detailed explanation). In most cases,
you can simply skip the creation of that file.

To actually generate the static files, execute:

```bash
gulp build
```

That will result in a new ```dist``` file containing all the files that must be
served to the clients.

### Step 3. Web server

As already explained, Jangouts consists just on a bunch of static files (HTML,
CSS and JavaScript) that, when executed by a web browser, will interact with a
Janus gateway. Typically a web server is used to serve those files and to
provide access to the Janus gateway, although the second part is not actually
mandatory and the Janus gateway can be accessed directly by the clients without
the intervention of the web server (which would need adjustment in the
```janusServer``` configuration parameter as explained in step 2).

Any web server can be used. As a reference, the configuration of Apache2 for a
standard Jangouts instance using virtual hosts with SSL support and with the
default configuration for both Janus and the javascript files is shown below.

```
<VirtualHost _default_:443>

  # General setup for the virtual host
  DocumentRoot /path/to/the/static/files
  ServerName example.com

  # SSL Engine Switch.
  # You DON'T need to enable ssl support in Janus, Apache will take care  
  SSLEngine on

  # Ajust if needed
  # SSLCertificateFile /your/cert.crt
  # SSLCertificateKeyFile /your/cert.key
  # SSLCertificateChainFile /your/cert-ca.crt

  <Directory "/path/to/the/static/files">
    # Controls who can get stuff from this server.
    Require all granted
  </Directory>

   # Set a proxy to Janus
   ProxyRequests Off
   ProxyVia Off
   ProxyPass /janus http://127.0.0.1:8088/janus
   ProxyPassReverse /janus http://127.0.0.1:8088/janus
</VirtualHost>
```

## A note about screen sharing

Browsers will refuse to allow screen sharing through WebRTC for connections not
using SSL. Thus, to allow users of your Jangouts instance to use the screen
sharing functionality you will have to provide HTTPS access to both the files
and the Janus gateway, like shown in the example configuration for Apache2
above.

## Development

### Requirements

In order to develop Jangouts, you need to install [Git](http://git-scm.com),
[Node.js](http://nodejs.org), [npm](http://npmjs.com), [Bower](http://bower.io)
and [Gulp.js](http://gulpjs.com).

Git, Node.js and npm should be available in any Linux distribution. For example, if you’re
running (open)SUSE you could type:

```
  zypper in git nodejs npm
```

Take into account that, in some cases, npm is bundled in the same package as Node.js.

If you prefer, you could use [Node Version
Manager](https://github.com/creationix/nvm) to install Node.js and npm.

Now, you must install Bower and Gulp.js through npm. Just type:

```
  sudo npm install -g bower gulp
```

### Dependencies

This project uses npm to manage development dependencies and Bower for runtime dependencies.
Those dependencies are defined in `package.json` and `bower.json` files. To install them,
just type:

```
  $ npm install && bower install
```

Take into accout that everytime a new dependency is added, you must run this command.

### Configuration

Configuration options are defined in `src/app/config.json`. At this time, Jangouts has only
1 configuration option. If you want to override any of option, you must use an additional
`src/app/config.local.json`.

### Serving

If you only want to make some development, you don’t need to install any webserver. Just type:

```
  $ gulp serve
```

Now you must be able to access with your browser through the URL `http://localhost:3001/`.

## Acknowledgments

* [Janus](http://janus.conf.meetecho.com/)

## License

This software is released under the terms of the MIT License. See the
[license file](LICENSE.txt) for more information.

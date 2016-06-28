# Building and testing Jangouts

This document describes how to set up your development environment to build and
test Jangouts. It also explains the basic mechanics of using `git`, `node`, and
`npm`.

* [Prerequisite Software](#prerequisite-software)
* [Getting the Sources](#getting-the-sources)
* [Installing NPM Modules](#installing-npm-modules)
* [Installing Janus](#installing-janus)
* [Build commands](#build-commands)
* [Running Tests Locally](#running-tests-locally)
* [Code Style](#code-style)
* [Project Information](#project-information)
* [CI using Travis](#ci-using-travis)
* [Debugging](#debugging)

See the [contribution guidelines](/CONTRIBUTING.md) if you'd like to contribute
to Jangouts.

## Prerequisite Software

Before you can build and test Jangouts, you must install and configure the
following products on your development machine:

* [Git](http://git-scm.com) and/or the **GitHub app** (for [Mac](http://mac.github.com)
  or [Windows](http://windows.github.com)); [GitHub's Guide to Installing
  Git](https://help.github.com/articles/set-up-git) is a good source of information.

* [Node.js](http://nodejs.org), (version `>=5.4.1 <6`) which is used to run a
  development web server, run tests, and generate distributable files. We also
  use Node's Package Manager, `npm` (version `>=3.5.3 <4.0`), which comes with
  Node. Depending on your system, you can install Node either from source or as
  a pre-packaged bundle.

* [Janus-Gateway](http://janus.conf.meetecho.com/) is the server-side WebRTC
  handling, so is necessary a running Janus server with support for data
  channels compiled in, with the videoroom plugin enabled and with a valid list
  of rooms in the `janus.plugin.videoroom.cfg` file. See more in [Installing
  Janus](#installing-janus)

* [Java Development Kit](http://www.oracle.com/technetwork/es/java/javase/downloads/index.html)
  which is used to execute the selenium standalone server for e2e testing.

## Getting the Sources

Fork and clone the Jangouts repository:

1. Login to your GitHub account or create one by following the instructions
   given [here](https://github.com/signup/free).
2. [Fork](http://help.github.com/forking) the [main Jangouts
   repository](https://github.com/jangouts/jangouts).
3. Clone your fork of the Jangouts repository and define an `upstream` remote
   pointing back to the Jangouts repository that you forked in the first place.

```shell
# Clone your GitHub repository:
git clone git@github.com:<github username>/jangouts.git

# Go to the Jangouts directory:
cd jangouts

# Add the main Jangouts repository as an upstream remote to your repository:
git remote add upstream https://github.com/jangouts/jangouts.git
```

## Installing NPM Modules


Next, install the JavaScript modules needed to build and test Jangouts:

```shell
# Install Jangouts project dependencies (package.json)
npm install
```

## Installing Janus

For most Linux distributions that translates into installing `janus` or
`janus-gateway` package.  Make sure those packages include data channels
support. Compiling Janus Gateway from the sources is, of course, also an option.

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

## Build commands

After you have installed all dependencies you can now run the app. Run `npm run
server` to start a local server using `webpack-dev-server` which will watch,
build (in-memory), and reload for you. The port will be displayed to you as
`http://0.0.0.0:4000` (or if you prefer IPv6, if you're using `express` server,
then it's `http://[::1]:4000/`).

### server
```bash
# development
npm run server
# production
npm run build:prod
npm run server:prod
```

## Other commands

### build files
```bash
# development
npm run build:dev
# production
npm run build:prod
```

## Running Tests Locally

### run tests
```bash
npm run test
```

Watch files and executing the tests whenever one of these files
change.

```bash
npm run test:watch
```

### run end-to-end tests
TODO

## Code Style

TODO

## Project Information

TODO

## CI using Travis

TODO




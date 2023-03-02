# Setting up the development environment

This document explains how to set up Jangouts for development and testing. As we use [Create React
App](https://github.com/facebook/create-react-app) to bootstrap the application, you might be
interested in checking the [Getting Started](https://facebook.github.io/create-react-app/docs/getting-started)
guide for further information.

## Step 1. Getting and configuring Jangouts

The first step to develop Jangouts is to get a local copy of its repository:

```sh
git clone https://github.com/jangouts/jangouts
```

If `git` is command not found, then install Git from you packager. For example, if you
are running (open)SUSE you could type:
```sh
sudo zypper in git
```

Once you get the source code, you may need to adapt the configuration by creating a file called
`public/config.json`. You have an sample file at `public/config.sample.json`. This step is usually
not needed if you are running a local instance of Janus Gateway listening on its standard wss port.

## Step 2. Install requirements

In addition to fetching the Jangouts source code, you also need to install
[Node.js](http://nodejs.org) and [npm](http://npmjs.com).

Node.js and npm should be available in any Linux distribution. For example, if you’re running
(open)SUSE you could type:

```sh
sudo zypper in nodejs nodejs-npm
```

Take into account that, in some cases, npm is bundled in the same package as Node.js.

If you prefer, you could use [Node Version Manager](https://github.com/creationix/nvm) to install
Node.js and npm.

Once you have installed Node.js and npm, just run this from the Jangouts directory (the one
containing the file `package.json`).

```sh
npm install
```

That will fetch all the development packages Jangouts depends on.

## Step 3. Start the webserver

If you only want to make some development, you don’t need to install any webserver. Just type:

```sh
npm start
```

Now point your browser to `http://localhost:3000/`, and you should be able to see the login screen.

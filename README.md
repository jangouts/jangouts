## Running the React/Redux based branch

[![Coverage Status](https://coveralls.io/repos/github/jangouts/jangouts/badge.svg?branch=master)](https://coveralls.io/github/jangouts/jangouts?branch=master)

This branch contains the [React](https://reactjs.org/) and
[Redux](https://react-redux.js.org/) based version of Jangouts. It is still a
work in progress, but the basic features are already in place. We plan to
replace the stable version with this one shortly. You can check the progress on
the [project's page](https://github.com/jangouts/jangouts/projects/1).

This document explains how to set up Jangouts for development and testing. As we
use [Create React App](https://github.com/facebook/create-react-app) to
bootstrap this branch, you might be interested in checking the [Getting
Started](https://facebook.github.io/create-react-app/docs/getting-started) guide
for further information.

### Testing and development

To use Jangouts, you need a [Janus](https://janus.conf.meetecho.com/) server.
After all, Jangouts is _just_ a user interface on top of Janus. We recommend
installing a recent version, like 0.8.2.

If your Linux distribution offers up-to-date packages, you can use them. For
instance, recent versions of Janus are available [for
SUSE/openSUSE](https://build.opensuse.org/package/show/network:jangouts/janus-gateway).

Alternatively, you can use [Docker](https://www.docker.com/). The repository
includes the required configuration files to set up the Janus server using
[Docker Compose](https://docs.docker.com/compose/). After installing
*docker-compose*, run:

    docker-compose up
    
Grab a coffee and wait for the service to be available.

Now, let's start Jangouts. You need [Node.js](https://nodejs.org/) and `npm` to
be available in your system. From the repository, run:

    npm start
    
Now point your browser to `http://localhost:3000/`, and you should be able to
see the login screen.

### Production

This version of Jangouts is not ready for prime-time yet. However, you can give
it a try by following almost the [same
instructions](https://github.com/jangouts/jangouts#installation) that you would
use for the stable version.

The only difference is step 3: instead of serving the `dist` folder, you need to
run the following command and serve the generated `build` folder:

    npm run-script build

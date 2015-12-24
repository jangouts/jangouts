# Setting up the development environment

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

Then you could adapt the configuration by creating a file called
`src/config.json`. You have an sample file in `src/config.json.sample`.

For a development environment, the next configuration would be fine:

```json
{
  "janusServer": "http://localhost:8088/janus"
}
```

## Step 2. Install requirements

In addition to fetching the Jangouts source code, you also need to install
[Node.js](http://nodejs.org), [npm](http://npmjs.com), [Bower](http://bower.io)
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

## Step 3. Install dependencies

This project uses npm to manage development dependencies and Bower for runtime dependencies.
Those dependencies are defined in `package.json` and `bower.json` files. To install them,
just type:

```sh
npm install && bower install
```

Bear in mind that every time a new dependency is added, you must run this command again.

## Step 4. Start the webserver

If you only want to make some development, you don’t need to install any
webserver. Just type:

```sh
gulp serve
```

Now you should be able to access with your browser through the URL
`http://localhost:3000/`.

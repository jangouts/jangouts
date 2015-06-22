# Deploying with Apache

As already explained, Jangouts only consists of a bunch of static files (HTML,
CSS and JavaScript) that, when executed by a web browser, will interact with a
Janus gateway. Typically a web server is used to serve those files and to
provide access to the Janus gateway, although the second part is not actually
mandatory and the Janus gateway can be accessed directly by the clients without
the intervention of the web server.

The purpose of this documents is give some hints about deploying Jangouts using
Apache to serve static files and proxy Janus gateway connections through
websockets. Bear in mind that using websockets is not mandatory, although is
recommended.

## Generating static files

By default, Jangouts will try to use websockets. It could be changed easily
just setting the `janusServer` parameter in `src/app/config.local.json`, as
shown in the [README](README.md).

After configuration is set, execute the following command to generate the
files:

```bash
gulp build
```

That will result in a new `dist` folder containing all the files that must be
served to the clients.

## Configuring Apache

Any web server can be used. As a reference, the configuration of Apache2 for a
standard Jangouts instance using virtual hosts with SSL support is shown below.

```
<VirtualHost _default_:443>

  # General setup for the virtual host
  DocumentRoot /path/to/the/static/files
  ServerName example.com

  # SSL Engine Switch.
  # You DON'T need to enable ssl support in Janus, Apache will take care  
  SSLEngine on

  # Adjust if needed
  # SSLCertificateFile /your/cert.crt
  # SSLCertificateKeyFile /your/cert.key
  # SSLCertificateChainFile /your/cert-ca.crt

  <Directory "/path/to/the/static/files">
    # Controls who can get stuff from this server.
    Require all granted
  </Directory>

   # Set a proxy to Janus
  ProxyVia Off
  ProxyPass /janus/ ws://127.0.0.1:8188/janus/
  ProxyPassReverse /janus/ ws://127.0.0.1:8188/janus
</VirtualHost>
```

Using websockets is not mandatory although is recommended. If you prefer using
HTTP, just change the Jangouts configuration and set the proxy section to
something like:

```
 ProxyRequests Off
 ProxyVia Off
 ProxyPass /janus http://127.0.0.1:8088/janus
 ProxyPassReverse /janus http://127.0.0.1:8088/janus
 ProxyRequests Off
```

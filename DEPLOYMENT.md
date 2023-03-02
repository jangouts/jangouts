# Deploying with Apache

As already explained, Jangouts only consists of a bunch of static files (HTML, CSS and JavaScript)
that, when executed by a web browser, will interact with a Janus gateway. Typically a web server is
used to serve those files and to provide access to the Janus gateway, although the second part is
not actually mandatory and the Janus gateway can be accessed directly by the clients without the
intervention of the web server.

The purpose of this documents is give some hints about deploying Jangouts using Apache to serve the
static files and proxy Janus gateway connections using SSL (i.e. HTTPS). As explained in the
[README](README.md), the usage of SSL is highly recommended in most scenarios.

When following these instructions, please beware trailing slashes in the example URLs and don't omit
them unless you know what you are doing. Often `http://example.url/dir` has a different meaning than
`http://example.url/dir/`.

## Configuring Apache

Any web server can be used. As a reference, the configuration of Apache2 for a standard Jangouts
instance using virtual hosts with SSL support is shown below.  As explained in the
[README](README.md), it's only necessary to serve the static files that are contained in the `build`
directory of the Jangouts release.

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
  ProxyRequests Off
  ProxyVia Off
  ProxyPass /janus/ ws://127.0.0.1:8188/janus/
  ProxyPassReverse /janus/ ws://127.0.0.1:8188/janus/
</VirtualHost>
```

Using websockets to interact with Janus is not mandatory although is recommended. If you prefer
using plain REST queries for any reason, just change the Jangouts configuration and set the proxy
section to something like:

```
 ProxyRequests Off
 ProxyVia Off
 ProxyPass /janus/ http://127.0.0.1:8088/janus/
 ProxyPassReverse /janus/ http://127.0.0.1:8088/janus/
```

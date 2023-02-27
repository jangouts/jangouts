# Troubleshooting

## The browser javascript console

During execution, Jangouts logs relevant information into the JavaScript console of the browser.
Thus, if Jangouts doesn't work as expected, the browser console is the main source of information to
identify the problem. The console can be easily activated following these instructions
[for Firefox](https://developer.mozilla.org/en-US/docs/Tools/Web_Console/Opening_the_Web_Console)
and
[for Chrome/Chromium](https://developers.google.com/web/tools/chrome-devtools/debug/console/console-ui?hl=en#opening-the-console).

## Enabling extra debugging information

Most common problems with Jangouts are related to the communication with the Janus gateway. If the
information provided by Jangouts in the console is not enough, it's possible to activate a more
verbose mode by setting the `janusDebug` parameter in `config.json`. To get full logs, set that
parameter to `true` or to the string `"all"`. Other values can be used to fine-tune the logging
level. Check the Janus documentation for more information.

## Checking Janus problems

If Jangouts cannot connect to Janus, the next step is to check if Janus is running properly. If
using systemd, e.g. using the mentioned (open)SUSE packages, use ```sudo systemctl status
janus.service```. If the status is "failed", check for possible reasons in ```journalctl --unit
janus.service```.

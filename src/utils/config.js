/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

// Values for the default configuration
const DEFAULT_CONFIG = {
  thumbnailMode: false,
  joinUnmutedLimit: 3
};

// Map protocols to ports
const PORTS = {
  ws: '8188',
  wss: '8189'
};

/**
 * Returns the default configuration
 *
 * @returns {Object}
 */
const defaultConfig = () => ({ ...DEFAULT_CONFIG, janusServer: defaultJanusServer() });

/**
 * Determines whether it is using SSL or not
 *
 * @returns {boolean}
 */
const usingSSL = () => window.location.protocol === 'https:';

/**
 * Returns the Janus server default URL
 *
 * @return {string}
 */
const defaultJanusServer = () => {
  const proto = usingSSL() ? 'wss' : 'ws';
  return `${proto}://${window.location.hostname}:${PORTS[proto]}/janus`;
};

/**
 * Replaces the placeholders in the configuration
 *
 * For the time being, only `%{hostname}` is supported.
 */
const replacePlaceholders = (text) => text.replace('%{hostname}', window.location.hostname);

/**
 * Parses a piece of JSON returning an empty object if it is not valid.
 *
 * @param {string} text Configuration (in JSON format).
 * @returns {Object}
 */
const parseJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    console.warn('The configuration is not valid JSON.', e);
    return {};
  }
};

/**
 * Parses and buids the configuration object.
 *
 * @param {string} text Configuration (in JSON format).
 * @returns {Object}
 */
function parseConfig(text) {
  const replacedText = replacePlaceholders(text);
  const config = parseJSON(replacedText);
  Object.keys(config).forEach((k) => {
    if (config[k] === undefined || config[k] === null) {
      delete config[k];
    }
  });
  return { ...defaultConfig(), ...config };
}

const READY_STATE_DONE = 4;
const STATUS_SUCCESS = 200;

/**
 * Fetches and parses the configuration from the `config.json` file.
 *
 * @returns {Object}
 */
export const fetch = () => {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.onload = function(e) {
      if (xhr.readyState === READY_STATE_DONE) {
        if (xhr.status === STATUS_SUCCESS) {
          resolve(parseConfig(xhr.responseText));
        } else {
          resolve(defaultConfig());
        }
      }
    };

    xhr.onerror = function(e) {
      resolve(defaultConfig());
    };

    xhr.open('GET', 'config.json');
    xhr.send(null);
  });
};

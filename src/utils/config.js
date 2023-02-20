/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

// Values for the default configuration
const DEFAULT_CONFIG = {
  janusDebug: false,
  janusWithCredentials: true,
  joinUnmutedLimit: 3,
  videoThumbnails: true
};

// Map protocols to ports
const PORTS = {
  ws: '8188',
  wss: '8989'
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
  return [
    `${proto}://${window.location.hostname}/janus/`,
    `${proto}://${window.location.hostname}:${PORTS[proto]}/janus/`
  ];
};

/**
 * Replaces the placeholders in the configuration
 *
 * For the time being, only `%{hostname}` is supported.
 */
const replacePlaceholders = (text) => text.replace(/%{hostname}/g, window.location.hostname);

/**
 * Parses and builds the configuration object.
 *
 * @param {string} text Configuration (in JSON format).
 * @returns {Object}
 */
function parseConfig(text) {
  const replacedText = replacePlaceholders(text);
  let config;
  try {
    config = JSON.parse(replacedText);
  } catch (e) {
    console.error(`Could not parse the configuration file: ${e}. Using default values.`);
    return defaultConfig();
  }

  Object.keys(config).forEach(k => {
    if (config[k] === undefined || config[k] === null) {
      delete config[k];
    }
  });
  return { ...defaultConfig(), ...config };
}

/**
 * Retrieves the configuration
 *
 * It tries to get a custom configuration from `/config.json`. If a valid configuration
 * file is found, it merges its values into the default ones. Otherwise, it returns
 * the default configuration.
 *  
 */
export const fetchConfig = async () => {
  const response = await fetch('/config.json');
  if (response.ok) {
    return parseConfig(await response.text());
  } else {
    console.warn("Could not load the configuration file. Using default values.");
    return defaultConfig();
  }
};

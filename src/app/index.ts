/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

/*
 * Error with the exported typings from zone.js
 * https://github.com/angular/zone.js/issues/297#issuecomment-200912405
 */
import "zone.js/dist/zone";
import "zone.js/dist/long-stack-trace-zone";

import "reflect-metadata";

require("./vendor.scss");
require("./index.scss");

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule);

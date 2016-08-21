/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";

import { Injectable } from "@angular/core";

interface IBroadcastEvent {
  key: any;
  data?: any;
}

/**
 * Class implementing a broadcast mechanism equivalent to the one available in
 * Angular 1
 */
@Injectable()
export class Broadcaster {
  private _eventBus: Subject<IBroadcastEvent>;

  constructor() {
    this._eventBus = new Subject<IBroadcastEvent>();
  }

  public broadcast(key: any, data?: any): void {
    this._eventBus.next({key, data});
  }

  public on<T>(key: any): Observable<T> {
    return this._eventBus.asObservable()
      .filter(event => event.key === key)
      .map(event => <T>event.data);
  }
}

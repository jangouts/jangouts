/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import * as _ from "lodash";

import { Injectable } from "@angular/core";

import { UserService } from "../user/user.service";
import { RoomService, Room } from "../room";

@Injectable()
export class StatesService {

  constructor(private roomService: RoomService,
              private userService: UserService) { }

  public setRoomAndUser(stateParams: any): Promise<any>  {
    let promise: Promise<any> = new Promise<any>((resolve, reject) => {

      // set username
      let userName: string = stateParams.user || this.userService.getSetting("lastUsername");
      if (userName) {
        this.userService.signin(userName);
      }

      // set room
      let roomId: number = parseInt(stateParams.room, 10);
      if (isNaN(roomId)) {
        this.roomService.setRoom(null);
        resolve();
      } else {
        this.roomService.getRooms().then((rooms) => {
          let result: Room = _.find(rooms, (room: Room) => {
            return room.id === roomId;
          });
          this.roomService.setRoom(result || null);
          resolve();
        });
      }
    });

    return promise;
  }
}

import { Injectable } from '@angular/core';
import {ParkingStatus} from "../model";
import {environment} from "../../environments/environment";

type StatusUpdater = (status: ParkingStatus) => void;

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket: WebSocket | null = null;
  private consumers: StatusUpdater[] = []

  public connect(): void {
    // this.socket = new WebSocket(`wss://user:password@${window.location.hostname}/ws`);
    this.socket = new WebSocket(environment.wsUrl);

    // Listen for messages
    this.socket.addEventListener('message', (event: MessageEvent<string>) => {
      const data: ParkingStatus = JSON.parse(event.data);
      this.consumers.forEach(c => c(data));
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
    this.socket = null;
    this.consumers = [];
  }

  public register(callback: StatusUpdater): void {
    this.consumers.push(callback);
  }

}

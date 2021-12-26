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
    this.socket = new WebSocket(environment.wsUrl);
    this.socket.addEventListener('open', (event: Event) => WebSocketService.onOpen(event));
    this.socket.addEventListener('close', (event: Event) => WebSocketService.onClose(event));
    this.socket.addEventListener('error', (event: Event) => WebSocketService.onError(event));
    this.socket.addEventListener('message', (event: MessageEvent<string>) => this.onMessageReceived(event));
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

  private static onOpen(event: Event): void {
    console.log('WebSocket connected', event);
  }

  private static onClose(event: Event): void {
    console.log('WebSocket disconnected', event);
  }

  private static onError(event: Event): void {
    console.error('WebSocket got error', event);
  }

  private onMessageReceived(event: MessageEvent<string>) {
    const data: ParkingStatus = JSON.parse(event.data);
    console.log('got message from WebSocket', data);
    this.consumers.forEach(c => c(data));
  }

}

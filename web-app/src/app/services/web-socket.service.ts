import { Injectable } from '@angular/core';
import {ParkingStatus, SingleEvent} from "../model";
import {environment} from "../../environments/environment";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket: WebSocket | null = null;

  public eventStream$ = new Subject<SingleEvent>();

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
    this.eventStream$.next(data);
  }

}

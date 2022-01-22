import { Injectable } from '@angular/core';
import {ParkingStatus, SingleEvent, WebSocketLifeCycleEvent} from "../model";
import {environment} from "../../environments/environment";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private socket: WebSocket | null = null;

  public eventStream$ = new Subject<SingleEvent>();
  public wsLifeCycleStream$ = new Subject<WebSocketLifeCycleEvent>();

  public connect(): void {
    this.socket = new WebSocket(environment.wsUrl);
    this.socket.addEventListener('open', (event: Event) => this.onOpen(event));
    this.socket.addEventListener('close', (event: Event) => this.onClose(event));
    this.socket.addEventListener('error', (event: Event) => this.onError(event));
    this.socket.addEventListener('message', (event: MessageEvent<string>) => this.onMessageReceived(event));
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
    this.socket = null;
  }

  private onOpen(event: Event): void {
    console.debug('WebSocket connected', event);
    this.wsLifeCycleStream$.next({
      type: 'connect',
      originalEvent: event
    })
  }

  private onClose(event: Event): void {
    console.debug('WebSocket disconnected', event);
    this.wsLifeCycleStream$.next({
      type: 'disconnect',
      originalEvent: event
    })
  }

  private onError(event: Event): void {
    console.error('WebSocket got error', event);
    this.wsLifeCycleStream$.next({
      type: 'error',
      originalEvent: event
    })
  }

  private onMessageReceived(event: MessageEvent<string>) {
    const data: ParkingStatus = JSON.parse(event.data);
    console.log('got message from WebSocket', data);
    this.eventStream$.next(data);
  }

}

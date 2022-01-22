import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ParkingStatus, SingleEvent, WebSocketLifeCycleEvent} from "./model";
import {environment} from "../environments/environment";
import {DataService} from "./services/data.service";
import * as moment from "moment";
import { Moment } from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // the below 2 fields are related to whether WS is connected
  public isConnected: boolean = false;
  public isConnecting: boolean = false;
  public connectTime: Moment | null = null;

  // the below field is related to whether there is a refresh
  // operation running (i.e. new capture is taken from camera,
  // and then processed)
  public isLoading: boolean = false;

  public status: ParkingStatus | null = null;
  public lastUpdate: Moment | null = null;
  public message: string | null = null;

  private timerInterval: NodeJS.Timer | null = null;

  constructor(private http: HttpClient,
              private dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.eventStream$.subscribe((response) => this.processEvent(response));
    this.dataService.wsLifeCycleStream$.subscribe((response) => this.processWebSocketLifeCycleEvent(response));
    this.connect();
  }

  private connect() {
    if (this.isConnected || this.isConnecting) {
      return; // nothing to do
    }
    this.isConnecting = true;
    this.lastUpdate = moment();
    this.connectTime = moment();
    this.updateTimerMessage();
    this.timerInterval = setInterval(() => this.updateTimerMessage(), 1000);
    this.dataService.connect();
  }

  private updateTimerMessage() {
    if (this.status) {
      this.message = `last update ${this.calculateSecondsSinceLastUpdate()} seconds ago\n(active for ${this.calculateTotalTime()})`;
    } else if (this.isLoading) {
      this.message = `Analyzing...\n(since ${this.calculateSecondsSinceLastUpdate()} seconds ago)`;
    } else if (this.isConnected) {
      this.message = `Connected, waiting...\n(since ${this.calculateSecondsSinceLastUpdate()} seconds ago)`;
    } else if (this.isConnecting) {
      this.message = `Connecting...\n(since ${this.calculateSecondsSinceLastUpdate()} seconds ago)`;
    }
  }

  private calculateTotalTime(): string {
    const duration = moment.duration(moment().diff(this.connectTime as Moment));
    return `${String(duration.minutes()).padStart(2, "0")}:${String(duration.seconds()).padStart(2, "0")}`;
  }

  processWebSocketLifeCycleEvent(event: WebSocketLifeCycleEvent):void {
    switch (event.type) {
      case "connect": {
        this.isConnecting = false;
        this.isConnected = true;
        break;
      }
      case "disconnect": {
        this.terminate('Disconnected');
        break;
      }
      case "error": {
        this.terminate(`Got error: ${JSON.stringify(event.originalEvent)}`);
        break;
      }
    }
  }

  private terminate(reason: string): void {
    this.isConnected = false;
    this.isConnecting = false;
    this.isLoading = false;
    this.status = null;
    this.clearInterval();
    this.message = reason;
  }

  processEvent(response: SingleEvent):void {
    switch (response.type) {
      case "update": {
        this.isLoading = false;
        this.status = response as ParkingStatus;
        this.lastUpdate = moment(this.status.lastUpdate);
        this.updateTimerMessage();
        break;
      }
      case "loading": {
        this.isLoading = true;
        break;
      }
      default: {
        console.warn('discarding unknown message', response);
        break
      }
    }
  }

  isAvailableSlot(): boolean {
    if (this.status) {
      return this.status.slots.some((slot) => slot.available);
    } else {
      return false;
    }

  }

  getBigAreaClass(): string {
    if (this.status) {
      return this.isAvailableSlot() ? 'available' : 'unavailable';
    } else {
      return '';
    }
  }

  calculateBigAreaIcon(): string {
    if (this.status) {
      return this.isLoading ? 'fas fa-spinner fa-8x fa-spin' : 'fas fa-parking fa-8x';
    } else if (this.isConnecting || this.isConnected || this.isLoading) {
      return 'fa-10x fab fa-connectdevelop fa-pulse icon-connecting';
    } else {
      return 'fa-10x fas fa-video-slash icon-connecting';
    }
  }

  getImageUrl(): string {
    return environment.apiBaseUrl + (this.status as ParkingStatus).image;
  }

  calculateSecondsSinceLastUpdate() {
    return moment().diff(this.lastUpdate, 'seconds');
  }

  private clearInterval(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
}

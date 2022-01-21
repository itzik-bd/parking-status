import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ParkingStatus, SingleEvent} from "./model";
import {environment} from "../environments/environment";
import {WebSocketService} from "./services/web-socket.service";
import * as moment from "moment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public status: ParkingStatus | null = null;
  public isLoading: boolean = false;
  public generalMessage: string | null = null;
  private timerInterval: NodeJS.Timer | null = null;

  constructor(private http: HttpClient,
              private webSocketService: WebSocketService) {
  }

  ngOnInit(): void {
    this.webSocketService.connect();
    this.webSocketService.eventStream$.subscribe((response) => this.processEvent(response));
    this.timerInterval = setInterval(() => this.updateTimer(), 1000);
  }

  updateTimer() {
    if (this.status) {
      this.generalMessage = `updated to ${this.calculateSecondsSinceLastUpdate()} seconds ago`;
    }
  }

  processEvent(response: SingleEvent):void {
    switch (response.type) {
      case "update": {
        this.isLoading = false;
        this.status = response as ParkingStatus;
        this.updateTimer();
        break;
      }
      case "loading": {
        this.isLoading = true;
        break;
      }
      default: {
        this.generalMessage = 'Error: unknown message';
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
    } else {
      return 'fa-10x fab fa-connectdevelop fa-pulse icon-connecting';
    }
  }

  getImageUrl(): string {
    return environment.apiBaseUrl + (this.status as ParkingStatus).image;
  }

  calculateSecondsSinceLastUpdate() {
    return moment().diff(moment((this.status as ParkingStatus).lastUpdate), 'seconds');
  }
}

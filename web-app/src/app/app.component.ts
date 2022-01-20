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

  constructor(private http: HttpClient,
              private webSocketService: WebSocketService) {
  }

  ngOnInit(): void {
    this.webSocketService.connect();
    this.webSocketService.eventStream$.subscribe((response) => this.processEvent(response));
  }

  processEvent(response: SingleEvent):void {
    this.generalMessage = null;

    switch (response.type) {
      case "update": {
        this.isLoading = false;
        this.status = response as ParkingStatus;
        break;
      }
      case "loading": {
        this.isLoading = true;
        break;
      }
      default: {
        this.generalMessage = 'שגיאה: הודעה לא מזוהה';
      }
    }
  }

  isAvailableSlot(): boolean {
    return (this.status as ParkingStatus).slots.some((slot) => slot.available);
  }

  getImageUrl(): string {
    if (this.status) {
      return environment.apiBaseUrl + (this.status as ParkingStatus).image;
    } else {
      return 'assets/image--placeholder.jpeg';
    }
  }

  getLastUpdateFromNow() {
    return moment((this.status as ParkingStatus).lastUpdate).locale('he').fromNow();
  }

  getLastUpdateTime() {
    return moment((this.status as ParkingStatus).lastUpdate).format('HH:mm:ss');
  }
}

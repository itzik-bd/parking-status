import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ParkingStatus} from "./model";
import {environment} from "../environments/environment";
import {WebSocketService} from "./services/web-socket.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public status: ParkingStatus | null = null;
  public isLoading: boolean = true;
  public error: string | null = null;

  constructor(private http: HttpClient,
              private webSocketService: WebSocketService) {
  }

  ngOnInit(): void {
    this.webSocketService.connect();
    this.webSocketService.register((response: ParkingStatus) => this.loadParkingStatus(response));
  }

  loadParkingStatus(response: ParkingStatus):void {
    this.isLoading = false;
    this.status = response;
  }

  isAvailableSlot(): boolean {
    return (this.status as ParkingStatus).slots.some((slot) => slot.available);
  }

  getImageUrl(): string {
    return environment.apiBaseUrl + (this.status as ParkingStatus).image;
  }
}

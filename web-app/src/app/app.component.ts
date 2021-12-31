import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ParkingStatus} from "./model";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public status: ParkingStatus | null = null;
  public isLoading: boolean = true;
  public error: string | null = null;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.loadParkingStatus();
  }

  loadParkingStatus():void {
    this.isLoading = true;
    return this.http.get<ParkingStatus>(`${environment.apiBaseUrl}status.json`, {withCredentials: true})
      .subscribe(
        (response: ParkingStatus) => this.status = response,
        (error) => this.error = error.message,
      )
      .add(() => this.isLoading = false)
  }


  isAvailableSlot(): boolean {
    return (this.status as ParkingStatus).slots.some((slot) => slot.available);
  }

  getImageUrl(): string {
    return environment.apiBaseUrl + (this.status as ParkingStatus).image;
  }
}

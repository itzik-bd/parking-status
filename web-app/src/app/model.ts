export interface ParkingStatus {
  slots: ParkingSlot[];
  image: string;
  lastUpdate: number;
}

export interface ParkingSlot {
  available: boolean;
}

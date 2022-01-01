export interface ParkingStatus extends SingleEvent{
  slots: ParkingSlot[];
  image: string;
  lastUpdate: number;
}

export interface ParkingSlot {
  available: boolean;
}

export interface SingleEvent {
  type: 'loading' | 'update';
}

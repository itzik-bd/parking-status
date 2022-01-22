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

export type WebSocketLifeCycleType = 'connect' | 'disconnect' | 'error';
export interface WebSocketLifeCycleEvent {
  type: WebSocketLifeCycleType;
  originalEvent: Event;
}

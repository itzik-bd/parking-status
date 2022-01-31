import {ImageURISource} from 'react-native';

export interface RawParkingSlot {
  available: boolean;
}

export interface ParkingSlot extends RawParkingSlot{
  id: string;
}

export interface RawParkingStatus {
  type: string;
  slots: RawParkingSlot[];
  image: string;
  lastUpdate: number;
}

export interface ParkingStatus {
  slots: ParkingSlot[];
  image: ImageURISource;
  lastUpdate: number;
}

export interface WebSocketDataLoading {
  type: string;
}

export type WebSocketData = WebSocketDataLoading | RawParkingStatus;

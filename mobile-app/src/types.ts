import {ImageURISource} from 'react-native';

export interface RawParkingSlot {
  available: boolean;
}

export interface ParkingSlot extends RawParkingSlot{
  id: string;
}

export interface RawParkingStatus {
  slots: RawParkingSlot[];
  image: string;
  lastUpdate: number;
}

export interface ParkingStatus {
  slots: ParkingSlot[];
  image: ImageURISource;
  lastUpdate: number;
}

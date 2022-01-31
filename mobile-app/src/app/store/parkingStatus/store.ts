import * as remx from 'remx';
import {ParkingSlot} from '../../../types';
import {ImageURISource} from 'react-native';

export type MessageStatus = 'loading' | 'update' | null;

export interface IParkingStatusStore {
  isInit: boolean;
  slots: ParkingSlot[];
  image: ImageURISource;
  websocket: WebSocket | null;
  messageStatus: MessageStatus;
}

const initialState: IParkingStatusStore = {
  isInit: false,
  slots: [],
  image: {},
  websocket: null,
  messageStatus: null,
};

const state: IParkingStatusStore = remx.state(initialState);

const getters = remx.getters({
  slots(): ParkingSlot[] {
    return state.slots;
  },
  image(): ImageURISource {
    return state.image;
  },
  isInit(): boolean {
    return state.isInit;
  },
  socket(): WebSocket | null {
    return state.websocket;
  },
  messageStatus(): MessageStatus {
    return state.messageStatus;
  },
});

const setters = remx.setters({
  slots(newData: ParkingSlot[]): void {
    state.slots = newData;
  },
  image(newImg: ImageURISource): void {
    state.image = newImg;
  },
  isInit(val: boolean): void {
    state.isInit = val;
  },
  socket(socket: WebSocket | null): void {
    state.websocket = socket;
  },
  messageStatus(message: MessageStatus): void {
    state.messageStatus = message;
  },
});

export const parkingStatusStore = {
  getters,
  setters,
};

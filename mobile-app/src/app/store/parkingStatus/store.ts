import * as remx from 'remx';
import {ParkingSlot} from '../../../types';

export interface IParkingStatusStore {
  isInit: boolean;
  slots: ParkingSlot[];
  image: string;
}

const initialState: IParkingStatusStore = {
  isInit: false,
  slots: [],
  image: '',
};

const state: IParkingStatusStore = remx.state(initialState);

const getters = remx.getters({
  slots(): ParkingSlot[] {
    return state.slots;
  },
  image(): string {
    return state.image;
  },
  isInit(): boolean {
    return state.isInit;
  },
});

const setters = remx.setters({
  slots(newData: ParkingSlot[]): void {
    state.slots = newData;
  },
  image(newImg: string): void {
    state.image = newImg;
  },
  isInit(val: boolean): void {
    state.isInit = val;
  },
});

export const parkingStatusStore = {
  getters,
  setters,
};

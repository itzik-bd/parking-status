import * as remx from 'remx';
import {ParkingSlot} from '../../../types';

export interface IParkingSlotsStore {
  isInit: boolean;
  slots: ParkingSlot[];
}

const initialState: IParkingSlotsStore = {
  isInit: false,
  slots: [],
};

const state: IParkingSlotsStore = remx.state(initialState);

const getters = remx.getters({
  slots(): ParkingSlot[] {
    return state.slots;
  },
  isInit(): boolean {
    return state.isInit;
  },
});

const setters = remx.setters({
  slots(newData: ParkingSlot[]): void {
    state.slots = newData;
  },
  isInit(val: boolean): void {
    state.isInit = val;
  },
});

export const parkingSlotsStore = {
  getters,
  setters,
};

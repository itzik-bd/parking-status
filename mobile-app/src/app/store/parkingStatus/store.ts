import * as remx from 'remx';
import {ParkingSlot} from '../../../types';
import {ImageURISource} from 'react-native';

export interface IParkingStatusStore {
  isInit: boolean;
  slots: ParkingSlot[];
  image: ImageURISource;
}

const initialState: IParkingStatusStore = {
  isInit: false,
  slots: [],
  image: {},
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
});

export const parkingStatusStore = {
  getters,
  setters,
};

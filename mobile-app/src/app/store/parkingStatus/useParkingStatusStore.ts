import {useEffect} from 'react';
import {ParkingSlot} from '../../../types';
import * as actions from './actions';
import {parkingStatusStore} from './store';
import {useConnect} from 'remx';
import {ImageURISource} from 'react-native';

export interface UseParkingStatusStore {
  slots: ParkingSlot[];
  isInit: boolean;
  image: ImageURISource;
}

export const useParkingStatusStore = (): UseParkingStatusStore => {
  const {slots, isInit, image} = useConnect(() => ({
    slots: parkingStatusStore.getters.slots(),
    isInit: parkingStatusStore.getters.isInit(),
    image: parkingStatusStore.getters.image(),
  }));

  useEffect(() => {
    actions.fetchDataIfNeeded();
  }, []);

  return {
    slots,
    isInit,
    image,
  };
};

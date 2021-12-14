import {useEffect} from 'react';
import {ParkingSlot} from '../../../types';
import * as actions from './actions';
import {parkingSlotsStore} from './store';
import {useConnect} from 'remx';

export interface UseParkingSlotsStore {
  slots: ParkingSlot[];
  isInit: boolean;
}

export const useParkingSlotsStore = (): UseParkingSlotsStore => {
  const {slots, isInit} = useConnect(() => ({
    slots: parkingSlotsStore.getters.slots(),
    isInit: parkingSlotsStore.getters.isInit(),
  }));

  useEffect(() => {
    actions.fetchDataIfNeeded();
  }, []);

  return {
    slots,
    isInit,
  };
};

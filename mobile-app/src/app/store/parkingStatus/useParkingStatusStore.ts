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
  isLoading: boolean;
}

export const useParkingStatusStore = (): UseParkingStatusStore => {
  const {slots, isInit, image, messageStatus} = useConnect(() => ({
    slots: parkingStatusStore.getters.slots(),
    isInit: parkingStatusStore.getters.isInit(),
    image: parkingStatusStore.getters.image(),
    messageStatus: parkingStatusStore.getters.messageStatus(),
  }));

  useEffect(() => {
    actions.createWebSocketIfNeeded();
    // return actions.clearWebSocket;
  }, []);

  const isLoading = messageStatus === 'loading';

  return {
    slots,
    isInit,
    image,
    isLoading,
  };
};

import {useCallback} from 'react';
import {useParkingSlotsStore} from '../../../../store/parkingSlots/useParkingSlotsStore';
import {ParkingSlot} from '../../../../../types';

export interface UseParkingSlotsList {
  slots: ParkingSlot[];
  isInit: boolean;
  keyExtractor: (item: ParkingSlot) => string;
}

export const useParkingSlotsList = (): UseParkingSlotsList => {
  const {slots, isInit} = useParkingSlotsStore();
  const keyExtractor = useCallback((item: ParkingSlot) => item.id, []);

  return  {
    slots,
    isInit,
    keyExtractor,
  };
};

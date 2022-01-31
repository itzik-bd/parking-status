import {useCallback, useMemo} from 'react';
import {useParkingStatusStore} from '../../../../store/parkingStatus/useParkingStatusStore';
import {ParkingSlot} from '../../../../../types';
import {StyleSheet} from 'react-native';

export interface UseParkingSlotsList {
  slots: ParkingSlot[];
  shouldRender: boolean | undefined;
  keyExtractor: (item: ParkingSlot) => string;
  styles: {
    skeleton: {
      width: number;
      height: number;
    };
    slots: {
      height: number;
    }
  };
}

export const useParkingSlotsList = (): UseParkingSlotsList => {
  const {slots, isInit} = useParkingStatusStore();
  const keyExtractor = useCallback((item: ParkingSlot) => item.id, []);
  const shouldRender = isInit ? true : undefined;
  const styles = useMemo(() => (
    StyleSheet.create({
      slots: {
        height: 70,
      },
      skeleton: {
        height: 50,
        width: slots.length * 55,
      },
    })
  ), [slots.length]);

  return  {
    slots,
    shouldRender,
    keyExtractor,
    styles,
  };
};

import {useParkingStatusStore} from '../../../../store/parkingStatus/useParkingStatusStore';
import {Colors} from 'react-native-ui-lib';

export interface UseStatusSection {
  bgColor: string;
  text: string;
}

export const useStatusSection = (): UseStatusSection => {
  const {slots} = useParkingStatusStore();
  const isEmpty = slots.some(slot => slot.available);
  const bgColor = isEmpty ? Colors.green40 : Colors.red40;
  const text = isEmpty ? 'yay! Empty' : 'dam, Nothing';

  return {
    bgColor,
    text,
  };
};

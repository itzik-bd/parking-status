import {useParkingStatusStore} from '../../../../store/parkingStatus/useParkingStatusStore';
import {Colors} from 'react-native-ui-lib';

export interface UseStatusSection {
  color: string;
  text: string;
}

export const useStatusSection = (): UseStatusSection => {
  const {slots, isLoading} = useParkingStatusStore();
  const isEmpty = slots.some(slot => slot.available);
  const color = isEmpty ? Colors.green20 : Colors.red20;
  const text = isLoading ? 'loading..' :
    isEmpty ? 'Empty' : 'Nothing';

  return {
    color,
    text,
  };
};

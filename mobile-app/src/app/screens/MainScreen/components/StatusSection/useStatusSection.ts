import {useParkingSlotsStore} from '../../../../store/parkingSlots/useParkingSlotsStore';
import {Colors} from 'react-native-ui-lib';

export interface UseStatusSection {
  shouldRender: boolean;
  bgColor: string;
  text: string;
}

export const useStatusSection = (): UseStatusSection => {
  const {slots, isInit: shouldRender} = useParkingSlotsStore();
  const isEmpty = shouldRender && slots.some(slot => slot.available);
  const bgColor = isEmpty ? Colors.green40 : Colors.red40;
  const text = isEmpty ? 'yay! Empty' : 'dam, Nothing';



  return {
    shouldRender,
    bgColor,
    text,
  };
};

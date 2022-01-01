import {useRefreshButton} from './hooks/useRefreshButton';
import {useParkingSlotsStore} from '../../store/parkingSlots/useParkingSlotsStore';

export interface UseMainScreenProps {
  componentId: string;
}

export interface UseMainScreen {
  shouldRender: boolean | undefined;
}

export const useMainScreen = (props: UseMainScreenProps): UseMainScreen => {
  useRefreshButton({componentId: props.componentId});
  const {isInit} = useParkingSlotsStore();
  const shouldRender = isInit ? true : undefined;

  return {
    shouldRender,
  };
};

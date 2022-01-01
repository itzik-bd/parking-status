import {useRefreshButton} from './hooks/useRefreshButton';
import {useParkingStatusStore} from '../../store/parkingStatus/useParkingStatusStore';

export interface UseMainScreenProps {
  componentId: string;
}

export interface UseMainScreen {
  shouldRender: boolean | undefined;
  image: {uri: string};
}

export const useMainScreen = (props: UseMainScreenProps): UseMainScreen => {
  useRefreshButton({componentId: props.componentId});
  const {isInit, image} = useParkingStatusStore();
  const shouldRender = isInit ? true : undefined;

  return {
    shouldRender,
    image: {uri: image},
  };
};

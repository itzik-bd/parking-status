import {useRefreshButton} from './hooks/useRefreshButton';
import {useParkingStatusStore} from '../../store/parkingStatus/useParkingStatusStore';
import {ImageURISource} from 'react-native';

export interface UseMainScreenProps {
  componentId: string;
}

export interface UseMainScreen {
  shouldRender: boolean | undefined;
  image: ImageURISource;
}

export const useMainScreen = (props: UseMainScreenProps): UseMainScreen => {
  useRefreshButton({componentId: props.componentId});
  const {isInit, image} = useParkingStatusStore();
  const shouldRender = isInit ? true : undefined;

  return {
    shouldRender,
    image,
  };
};

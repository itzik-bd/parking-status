import {useNavigationButtonPress} from 'react-native-navigation-hooks';
import {buttonIds} from '../../../../constants/buttonIds';
import {useCallback} from 'react';
import * as parkingStatusActions from '../../../store/parkingStatus/actions';

export interface UseRefreshButtonProps {
  componentId: string;
}

export const useRefreshButton = (props: UseRefreshButtonProps) => {
  const onPress = useCallback(() => {
    parkingStatusActions.clearState();
    parkingStatusActions.refreshWebsocket();
  }, [parkingStatusActions.refreshWebsocket]);

  useNavigationButtonPress(onPress, props.componentId, buttonIds.topBar.refresh);
};
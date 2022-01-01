import {useNavigationButtonPress} from 'react-native-navigation-hooks';
import {buttonIds} from '../../../../constants/buttonIds';
import {useCallback} from 'react';
import * as parkingSlotsActions from '../../../store/parkingSlots/actions';

export interface UseRefreshButtonProps {
  componentId: string;
}

export const useRefreshButton = (props: UseRefreshButtonProps) => {
  const onPress = useCallback(() => {
    parkingSlotsActions.fetchData();
  }, [parkingSlotsActions.fetchData]);

  useNavigationButtonPress(onPress, props.componentId, buttonIds.topBar.refresh);
};

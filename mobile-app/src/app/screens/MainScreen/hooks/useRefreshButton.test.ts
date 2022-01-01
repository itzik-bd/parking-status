import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'ts-jest/utils';
import * as parkingSlotsActions from '../../../store/parkingSlots/actions';
import {useNavigationButtonPress} from 'react-native-navigation-hooks';
import {useRefreshButton as uut} from './useRefreshButton';
import {buttonIds} from '../../../../constants/buttonIds';

jest.mock('../../../store/parkingSlots/actions');
jest.mock('react-native-navigation-hooks');

const mockComponentId = 'someComponentId';

describe('useRefreshButton', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const getOnPressHandler = () => {
    return mocked(useNavigationButtonPress).mock.calls[0][0];
  };

  it('should fetch parking slots data on press', () => {
    const {result} = renderHook(() => uut({componentId: mockComponentId}));
    const onPress = getOnPressHandler();
    onPress({buttonId: buttonIds.topBar.refresh, componentId: mockComponentId});
    expect(parkingSlotsActions.fetchData).toBeCalledWith();
    expect(parkingSlotsActions.fetchData).toBeCalledTimes(1);
  });
});

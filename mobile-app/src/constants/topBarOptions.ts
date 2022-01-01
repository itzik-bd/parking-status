import {buttonIds} from './buttonIds';
import {OptionsTopBar} from 'react-native-navigation';
import {Colors} from 'react-native-ui-lib';

export const topBarOptions: OptionsTopBar = {
  title: {
    text: 'Parking Status',
    fontStyle: 'italic',
  },
  rightButtons: [
    {
      id: buttonIds.topBar.refresh,
      text: 'Refresh',
      color: Colors.blue30,
    },
  ],
};

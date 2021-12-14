import {Navigation} from 'react-native-navigation';
import {screenIds} from './constants/screenIds';
import {MainScreen} from './app/screens/MainScreen';

export const registerComponents = () => {
  Navigation.registerComponent(screenIds.main, () => MainScreen);
};

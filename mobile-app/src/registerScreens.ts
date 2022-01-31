import {Navigation} from 'react-native-navigation';
import {screenIds} from './constants/screenIds';
import {MainScreen} from './app/screens/MainScreen';
import {DemoScreen} from './app/screens/DemoScreen';

export const registerScreens = () => {
  Navigation.registerComponent(screenIds.main, () => MainScreen);
  Navigation.registerComponent(screenIds.demo, () => DemoScreen);
};

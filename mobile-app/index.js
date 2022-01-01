/**
 * @format
 */

import {Navigation} from 'react-native-navigation';
import {registerComponents} from './src/registerComponents';
import {demoTabStack, mainTabStack} from './src/constants/bottomTabs';

registerComponents();
console.disableYellowBox = true;

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      bottomTabs: {
        children: [
          mainTabStack,
          demoTabStack,
        ],
      }
    },
  });
});

/**
 * @format
 */

import {Navigation} from 'react-native-navigation';
import {demoTabStack, mainTabStack} from './src/constants/bottomTabs';
import {registerScreens} from './src/registerScreens';
import {_environment} from './src/app/environment';

registerScreens();
console.disableYellowBox = true;

const developmentEnvRoot = {
  bottomTabs: {
    children: [
      mainTabStack,
      demoTabStack,
    ],
  },
};

const productionEnvRoot = {
  stack: mainTabStack.stack,
};

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: _environment.isDevMode ? developmentEnvRoot : productionEnvRoot,
  });
});

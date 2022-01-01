/**
 * @format
 */

import {Navigation} from 'react-native-navigation';
import {demoTabStack, mainTabStack} from './src/constants/bottomTabs';
import {registerScreens} from './src/registerScreens';

registerScreens();
console.disableYellowBox = true;

// todo: use enviroment variable
const isDevMode = true;

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
    root: isDevMode ? developmentEnvRoot : productionEnvRoot,
  });
});

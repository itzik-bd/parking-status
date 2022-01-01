import {LayoutTabsChildren} from 'react-native-navigation';
import {screenIds} from './screenIds';
import {Colors} from 'react-native-ui-lib';

export const mainTabStack: LayoutTabsChildren = {
  stack: {
    children: [
      {
        component: {
          name: screenIds.main,
          options: {
            bottomTab: {
              text: 'Main',
              selectedTextColor: Colors.blue30,
            },
          }
        },
      },
    ],
  },
};

export const demoTabStack: LayoutTabsChildren = {
  stack: {
    children: [
      {
        component: {
          name: screenIds.demo,
          options: {
            bottomTab: {
              text: 'Demo',
              selectedTextColor: Colors.blue30,
            },
          }
        },
      },
    ],
  },
};

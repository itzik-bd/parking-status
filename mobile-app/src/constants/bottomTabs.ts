import {LayoutTabsChildren} from 'react-native-navigation';
import {screenIds} from './screenIds';
import {Colors} from 'react-native-ui-lib';

const createTabStack = (screenId: string, tabText: string): LayoutTabsChildren => ({
  stack: {
    children: [
      {
        component: {
          name: screenId,
          options: {
            bottomTab: {
              text: tabText,
              selectedTextColor: Colors.blue30,
            },
          }
        },
      },
    ],
  },
});

export const mainTabStack: LayoutTabsChildren = createTabStack(screenIds.main, 'Main');
export const demoTabStack: LayoutTabsChildren = createTabStack(screenIds.demo, 'Demo');

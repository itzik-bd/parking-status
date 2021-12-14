/**
 * @format
 */

import {Navigation} from 'react-native-navigation';
import {registerComponents} from './src/registerComponents';
import {screenIds} from './src/constants/screenIds';

registerComponents();

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: screenIds.main,
              options: {
                topBar: {
                  title: {
                    text: 'Parking Status Mobile',
                  },
                },
              },
            },
          },
        ],
      },
    },
  });
});

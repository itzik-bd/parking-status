import React from 'react';
import {View, Text} from 'react-native-ui-lib';
import {ParkingSlotList} from './components/ParkingSlotsList/';
import {StatusSection} from './components/StatusSection';
import {useRefreshButton} from './hooks/useRefreshButton';
import {topBarOptions} from '../../../constants/topBarOptions';

export interface MainScreenProps {
  componentId: string;
}

const MainScreen = (props: MainScreenProps) => {
  useRefreshButton({componentId: props.componentId});

  return (
    <View flex>
      <ParkingSlotList />
      <StatusSection />
      <View flex center bg-grey10>
        <Text text30 white>Image</Text>
      </View>
    </View>
  );
};

MainScreen.options = {
  topBar: topBarOptions,
};

export {MainScreen};

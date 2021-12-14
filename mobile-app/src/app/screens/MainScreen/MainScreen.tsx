import React from 'react';
import {View, Text} from 'react-native-ui-lib';
import {ParkingSlotList} from './components/ParkingSlotsList/';

export const MainScreen = () => {
  return (
    <View flex>
      <ParkingSlotList />
      <View flex center bg-green40>
        <Text text30 white>Empty</Text>
      </View>
      <View flex center bg-grey10>
        <Text text30 white>Image</Text>
      </View>
    </View>
  );
};

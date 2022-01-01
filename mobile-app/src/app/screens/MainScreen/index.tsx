import React, {useCallback} from 'react';
import {View, Text} from 'react-native-ui-lib';
import {ParkingSlotList} from './components/ParkingSlotsList/';
import {StatusSection} from './components/StatusSection';
import {topBarOptions} from '../../../constants/topBarOptions';
import {useMainScreen} from './useMainScreen';

export interface MainScreenProps {
  componentId: string;
}

const MainScreen = (props: MainScreenProps) => {
  const {shouldRender} = useMainScreen({componentId: props.componentId});
  const renderBody = useCallback(() => {
    return (
      <>
        <StatusSection />
        <View flex center bg-grey10>
          <Text text30 white>Image</Text>
        </View>
      </>
    )
  }, []);

  const renderEmptyState = useCallback(() => {
    return (
      <View flex center>
        <Text white text10>Ops!</Text>
        <Text white text40>No data, loading..</Text>
      </View>
    );
  }, []);

  return (
    <View flex>
      <ParkingSlotList />
      {shouldRender ? renderBody() : renderEmptyState()}
    </View>
  );
};

MainScreen.options = {
  topBar: topBarOptions,
};

export {MainScreen};

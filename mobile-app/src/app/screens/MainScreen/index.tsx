import React, {useCallback} from 'react';
import {View, Text, Image} from 'react-native-ui-lib';
import {ParkingSlotList} from './components/ParkingSlotsList/';
import {StatusSection} from './components/StatusSection';
import {topBarOptions} from '../../../constants/topBarOptions';
import {useMainScreen} from './useMainScreen';
import {StyleSheet} from 'react-native';

export interface MainScreenProps {
  componentId: string;
}

const MainScreen = (props: MainScreenProps) => {
  const {shouldRender, image} = useMainScreen({componentId: props.componentId});
  const renderBody = useCallback(() => {
    return (
      <>
        <StatusSection />
        <Image source={image} style={styles.img} />
      </>
    )
  }, [image]);

  const renderEmptyState = useCallback(() => {
    return (
      <View flex center>
        <Text grey10 text10>Ops!</Text>
        <Text grey10 text40>No data, loading..</Text>
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

const styles = StyleSheet.create({
  img: {
    width: '100%',
    aspectRatio: 1920 / 1080,
  },
});

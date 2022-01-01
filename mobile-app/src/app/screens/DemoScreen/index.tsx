import React, {useCallback} from 'react';
import {View, Button} from 'react-native-ui-lib';
import {parkingSlotsStore} from '../../store/parkingSlots/store';

const DemoScreen = () => {
  const onPressToggle = useCallback(() => {
    console.log('** Demo onPressSetNotLoaded');
    parkingSlotsStore.setters.isInit(!parkingSlotsStore.getters.isInit());
  }, []);

  return (
    <View flex center bg-grey60>
      <Button label={'Toggle is data loaded'} onPress={onPressToggle} />
    </View>
  );
};

DemoScreen.options = {
  topBar: {
    title: {
      text: 'Demo Tab',
    },
  },
};

export {DemoScreen};

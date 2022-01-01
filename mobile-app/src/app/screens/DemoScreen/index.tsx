import React, {useCallback} from 'react';
import {View, Button} from 'react-native-ui-lib';
import {parkingSlotsStore} from '../../store/parkingSlots/store';

const DemoScreen = () => {
  const onPressToggle = useCallback(() => {
    parkingSlotsStore.setters.isInit(!parkingSlotsStore.getters.isInit());
  }, []);

  const onSetNotAvailablePress = useCallback(() => {
    const list = parkingSlotsStore.getters.slots().map(slot => {
      slot.available = false;
      return slot;
    });
    parkingSlotsStore.setters.slots(list);
    parkingSlotsStore.setters.isInit(true);
  }, []);

  const onSetOnlyFirstAvailable = useCallback(() => {
    const list = parkingSlotsStore.getters.slots().map((slot, index) => {
      slot.available = index === 0;
      return slot;
    });
    parkingSlotsStore.setters.slots(list);
    parkingSlotsStore.setters.isInit(true);
  }, []);

  const buttonList: { handler: () => void; label: string }[] = [
    {label: 'Toggle is data loaded', handler: onPressToggle},
    {label: 'Set not available', handler: onSetNotAvailablePress},
    {label: 'Set only first as available', handler: onSetOnlyFirstAvailable},
  ];

  return (
    <View flex center bg-grey60>
      {buttonList.map(btn => <Button label={btn.label} onPress={btn.handler} key={btn.label} marginV-10 />)}
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

import React, {useCallback} from 'react';
import {View} from 'react-native-ui-lib';
import {parkingStatusStore} from '../../store/parkingStatus/store';
import {Button} from 'react-native-ui-lib';

const DemoScreen = () => {
  const onTogglePress = useCallback(() => {
    parkingStatusStore.setters.isInit(!parkingStatusStore.getters.isInit());
  }, []);

  const onSetNotAvailablePress = useCallback(() => {
    const list = parkingStatusStore.getters.slots().map(slot => {
      slot.available = false;
      return slot;
    });
    parkingStatusStore.setters.slots(list);
    parkingStatusStore.setters.isInit(true);
  }, []);

  const onSetOnlyFirstAvailable = useCallback(() => {
    const list = parkingStatusStore.getters.slots().map((slot, index) => {
      slot.available = index === 0;
      return slot;
    });
    parkingStatusStore.setters.slots(list);
    parkingStatusStore.setters.isInit(true);
  }, []);

  const buttonList: { handler: () => void; label: string }[] = [
    {label: 'Toggle is data loaded', handler: onTogglePress},
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

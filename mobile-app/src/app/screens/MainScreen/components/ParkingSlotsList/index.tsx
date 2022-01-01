import {FlatList} from 'react-native';
import {View, SkeletonView} from 'react-native-ui-lib';
import React, {useCallback} from 'react';
import {ParkingItem} from './ParkingItem';
import {ParkingSlot} from '../../../../../types';
import {useParkingSlotsList} from './useParkingSlotsList';

export const ParkingSlotList = () => {
  const {slots, shouldRender, keyExtractor, styles} = useParkingSlotsList();

  const renderItem = useCallback(({item}: {item: ParkingSlot}) => {
    return <ParkingItem available={item.available} show={shouldRender} />;
  }, [shouldRender]);

  return (
    <View style={styles.slots} bg-white center>
      <FlatList
        data={slots}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
      />
    </View>
  );
};

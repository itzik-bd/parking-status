import {FlatList, StyleSheet} from 'react-native';
import {View} from 'react-native-ui-lib';
import React, {useCallback} from 'react';
import {ParkingItem} from './ParkingItem';
import {ParkingSlot} from '../../../../../types';
import {useParkingSlotsList} from './useParkingSlotsList';

export const ParkingSlotList = () => {
  const {slots, isInit, keyExtractor} = useParkingSlotsList();
  const renderItem = useCallback(({item}: {item: ParkingSlot}) => {
    return (
      <ParkingItem available={item.available} loaded={isInit} />
    );
  }, []);

  return (
    <View style={styles.slots} bg-grey70 center>
      <FlatList
        data={slots}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
      />
    </View>
  );
};

const styles = StyleSheet.create({
  slots: {
    height: 70,
  },
});

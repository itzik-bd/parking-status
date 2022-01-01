import React from 'react';
import {Colors, View, Text} from 'react-native-ui-lib';
import {StyleSheet} from 'react-native';

export interface ParkingItemProps {
  available: boolean;
}

export const ParkingItem = React.memo((props: ParkingItemProps) => {
  const bgColor = props.available ? Colors.green30 : Colors.red30;

  return (
    <View style={styles.container} backgroundColor={bgColor} center>
      <Text text30BO white>P</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    marginVertical: 10,
    marginHorizontal: 5,
  },
});

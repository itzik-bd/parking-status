import React, {useCallback} from 'react';
import {Colors, View, Text, SkeletonView} from 'react-native-ui-lib';
import {StyleSheet} from 'react-native';

export interface ParkingItemProps {
  available: boolean;
  show: boolean | undefined;
}

export const ParkingItem = React.memo((props: ParkingItemProps) => {
  const render = useCallback(() => {
    const bgColor = props.available ? Colors.green30 : Colors.red30;
    return (
      <View style={styles.container} backgroundColor={bgColor} center>
        <Text text30BO white>P</Text>
      </View>
    );
  }, [props.available]);

  return (
    <SkeletonView
      width={styles.container.width}
      height={styles.container.width}
      showContent={props.show}
      renderContent={render}
      style={styles.container}
    />
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

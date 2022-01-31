import React from 'react';
import {View, Text} from 'react-native-ui-lib';
import {useStatusSection} from './useStatusSection';

export const StatusSection = React.memo(() => {
  const {color, text} = useStatusSection();

  return (
    <View flex center>
      <Text text10M color={color}>{text}</Text>
    </View>
  );
});

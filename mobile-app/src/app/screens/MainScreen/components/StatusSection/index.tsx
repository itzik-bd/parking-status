import React from 'react';
import {View, Text} from 'react-native-ui-lib';
import {useStatusSection} from './useStatusSection';

export const StatusSection = React.memo(() => {
  const {bgColor, text} = useStatusSection();

  return (
    <View flex center backgroundColor={bgColor}>
      <Text text20 white>{text}</Text>
    </View>
  );
});

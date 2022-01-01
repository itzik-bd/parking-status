import React, {useCallback} from 'react';
import {View, Text} from 'react-native-ui-lib';
import {useStatusSection} from './useStatusSection';

export const StatusSection = React.memo(() => {
  const {shouldRender, bgColor, text} = useStatusSection();

  const renderEmptyState = useCallback(() => (
    <View flex center bg-grey50>
      <Text text40T grey10>I don't know yet..</Text>
      <Text text10 grey10>Sorry!</Text>
    </View>
  ), []);

  const render = useCallback(() => (
    <View flex center backgroundColor={bgColor}>
      <Text text20 white>{text}</Text>
    </View>
  ), [bgColor, text]);

  return shouldRender ? render() : renderEmptyState();
});

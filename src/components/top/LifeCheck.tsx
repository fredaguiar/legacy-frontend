import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@rneui/themed';
import useAuthStore from '../../store/useAuthStore';
import SpinnerUI from '../ui/SpinnerUI';
import LifeCheckUI from '../ui/LifeCheckUI';

const LifeCheck = () => {
  const { user } = useAuthStore();
  const {
    theme: { colors },
  } = useTheme();

  return (
    <View style={[{ backgroundColor: colors.background2 }]}>
      <View
        style={[
          {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 4,
          },
        ]}>
        <Text
          style={{
            fontWeight: '800',
            fontSize: 20,
          }}>
          {user?.firstName} {user?.lastName}
        </Text>
        <LifeCheckUI currentScreen="home" />
      </View>
    </View>
  );
};

export default LifeCheck;

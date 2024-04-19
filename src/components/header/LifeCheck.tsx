import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@rneui/themed';
import SwitchUI from '../ui/SwitchUI';
import useAuthStore from '../../store/useAuthStore';

const LifeCheck = () => {
  const [lifeCheck, setLifeCheck] = useState(false);
  const { user } = useAuthStore();
  const {
    theme: { colors },
  } = useTheme();

  return (
    <View
      style={[
        {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 4,
          backgroundColor: colors.background2,
        },
      ]}>
      <Text
        style={{
          fontWeight: '800',
          fontSize: 20,
        }}>
        {user?.firstName} {user?.lastName}
      </Text>
      <View style={[{}]}>
        <Text
          style={{
            fontWeight: '800',
            fontSize: 20,
          }}>
          Life check
        </Text>
        <View style={[{ display: 'flex', flexDirection: 'row' }]}>
          <SwitchUI
            on={false}
            onToggle={(on: boolean) => {
              setLifeCheck(on);
            }}
          />
          <Text
            style={{
              fontWeight: '800',
              fontSize: 20,
            }}>
            {lifeCheck ? 'On' : 'Off'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LifeCheck;

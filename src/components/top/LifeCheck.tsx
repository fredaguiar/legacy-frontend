import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import useUserStore from '../../store/useUserStore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LifeCheckUI from '../ui/LifeCheckUI';

const LifeCheck = () => {
  const { user } = useUserStore();
  const navigation = useNavigation();
  const {
    theme: { colors },
  } = useTheme();

  return (
    <View style={[{ backgroundColor: colors.background2 }]}>
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 4,
            justifyContent: 'space-between',
          },
        ]}>
        <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
          <TouchableOpacity
            onPress={() => {
              console.log(' >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> DRAWER OPEN');
              navigation.dispatch(DrawerActions.openDrawer());
            }}>
            <MaterialCommunityIcons name="menu" size={30} style={{ marginRight: 5 }} />
          </TouchableOpacity>
          <Text style={{ fontWeight: '800', fontSize: 20 }}>
            {user?.firstName} {user?.lastName}
          </Text>
        </View>
        <LifeCheckUI currentScreen="home" style={{ marginRight: 10 }} />
      </View>
    </View>
  );
};

export default LifeCheck;

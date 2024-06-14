import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import useUserStore from '../../store/useUserStore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LifeCheckUI from '../ui/LifeCheckUI';

const Header = () => {
  const { user } = useUserStore();
  const navigation = useNavigation();
  const {
    theme: { colors },
  } = useTheme();

  return (
    <View style={[{ backgroundColor: colors.background3 }]}>
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
              navigation.dispatch(DrawerActions.openDrawer());
            }}>
            <MaterialCommunityIcons name="menu-down" size={50} style={{ marginHorizontal: 10 }} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, width: 210 }} numberOfLines={1} ellipsizeMode="tail">
            {`${user?.firstName} ${user?.lastName}`}
          </Text>
        </View>
        <LifeCheckUI currentScreen="home" style={{ marginRight: 10 }} />
      </View>
    </View>
  );
};

export default Header;

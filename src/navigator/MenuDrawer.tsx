import {
  DrawerContentScrollView,
  DrawerItem,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from '@rneui/themed';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PrivateStack, { PrivateRootStackParams } from './PrivateStack';
import LifeCheck from '../components/top/LifeCheck';
import useUserStore from '../store/useUserStore';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export type MenuDrawerParams = {
  LifeCheckHelp: undefined;
};

const Drawer = createDrawerNavigator();

type MenuDrawerItemProps = {
  label: string;
  icon: string;
  onPress: () => void;
};

const MenuDrawerItem = (props: MenuDrawerItemProps) => {
  return (
    <DrawerItem
      {...props}
      style={{ padding: 5 }}
      labelStyle={{ fontSize: 20 }}
      icon={() => <MaterialCommunityIcons name={props.icon} size={40} />}
    />
  );
};

const MenuDrawer = () => {
  const navigation = useNavigation<NavigationProp<PrivateRootStackParams>>();
  const { user } = useUserStore();
  const {
    theme: { colors },
  } = useTheme();
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <DrawerContentScrollView
          {...props}
          style={{ backgroundColor: colors.row1 }}
          contentContainerStyle={{ width: 'auto' }}>
          <View style={{ backgroundColor: colors.background2, padding: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text>{user?.email} </Text>
          </View>
          <MenuDrawerItem
            label="User profile"
            icon="account-edit"
            onPress={() => navigation.navigate('UserProfile')}
          />
          <MenuDrawerItem
            label={'Life check setup'}
            icon="bell-ring"
            onPress={() => navigation.navigate('LifeCheckSetup')}
          />
        </DrawerContentScrollView>
      )}>
      <Drawer.Screen name="p1" component={PrivateStack} />
    </Drawer.Navigator>
  );
};

export default MenuDrawer;

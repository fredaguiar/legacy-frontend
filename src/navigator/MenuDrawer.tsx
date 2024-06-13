import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { View } from 'react-native';
import { Text } from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PrivateStack from './PrivateStack';

export type MenuDrawerParams = {
  LifeCheckHelp: undefined;
};

const Drawer = createDrawerNavigator();

const MenuDrawer = () => (
  <Drawer.Navigator
    drawerContent={(props) => (
      <View>
        <View>
          <Text>pag 1</Text>
        </View>
        <View>
          <Text>pag 2</Text>
        </View>
      </View>
    )}>
    <Drawer.Screen name="p1" component={PrivateStack} />
  </Drawer.Navigator>
);

export default MenuDrawer;

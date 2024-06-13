import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import React from 'react';
import { View } from 'react-native';
import { Divider, Text, useTheme } from '@rneui/themed';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useUserStore from '../store/useUserStore';
import * as SecureStore from 'expo-secure-store';
import { JWT_TOKEN } from '../Const';
import useSafeStore from '../store/useSafeStore';
import LifeCheck from '../components/top/LifeCheck';
import Home from '../components/home/Home';
import LifeCheckSetup from '../components/user/LifeCheckSetup';
import UserProfile from '../components/user/UserProfile';
import AutoSharing from '../components/safe/autoSharing/AutoSharing';
import ContactListUpdate from '../components/safe/autoSharing/ContactListUpdate';
import LifeCheckHelp from '../components/user/LifeCheckHelp';
import SafeOption from '../components/safe/SafeOption';
import AudioRecord from '../components/safe/AudioRecord';
import SavePassword from '../components/safe/SavePassword';
import TextEditor from '../components/safe/TextEditor';
import AddItems from '../components/safe/AddItems';
import CreateSafe from '../components/safe/CreateSafe';
import LifeCheckFrequency from '../components/user/LifeCheckFrequency';

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

export type MenuDrawerParams = {
  Home: undefined;
  CreateSafe: undefined;
  SafeOption: { safeId: string };
  LifeCheckSetup: undefined;
  LifeCheckHelp: undefined;
  LifeCheckFrequency: undefined;
  UserProfile: undefined;
  AutoSharing: { safeId: string };
  ContactListUpdate: { safeId: string; type: TContactInfoType };
  AddItems: { itemType: TFileType };
  TextEditor: { fileId?: string; localFilePath?: string; title?: string };
  SavePassword: {
    fileId?: string;
    safeId?: string;
    title?: string;
    username?: string;
    password?: string;
    notes?: string;
  };
  AudioRecord: {
    fileId?: string;
    localFilePath?: string;
    title?: string;
    mode: 'audio' | 'record';
  };
  Tab: undefined;
};

const MenuDrawerContent = (props: DrawerContentComponentProps) => {
  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();
  const { user, setUser } = useUserStore();
  const { setSafeId } = useSafeStore();
  const {
    theme: { colors },
  } = useTheme();
  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: colors.row1 }}
      contentContainerStyle={{ width: 300 }}>
      <View style={{ backgroundColor: colors.background2, padding: 10 }}>
        <Text style={{ fontWeight: 'bold' }}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text>{user?.email} </Text>
      </View>
      <MenuDrawerItem
        label="Home"
        icon="home"
        onPress={() => {
          setSafeId(undefined);
          navigation.navigate('Home');
        }}
      />
      <MenuDrawerItem
        label="User profile"
        icon="account-edit"
        onPress={() => navigation.navigate('UserProfile')}
      />
      <MenuDrawerItem
        label="Life check setup"
        icon="bell-ring"
        onPress={() => navigation.navigate('LifeCheckSetup')}
      />
      <Divider style={{ borderWidth: 1, borderColor: colors.divider }} />
      <MenuDrawerItem
        label="Logout"
        icon="logout"
        onPress={() => {
          setUser(undefined);
          setSafeId(undefined);
          SecureStore.setItemAsync(JWT_TOKEN, '');
        }}
      />
      <Divider style={{ borderWidth: 1, borderColor: colors.divider }} />
    </DrawerContentScrollView>
  );
};

const MenuDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={MenuDrawerContent}
      screenOptions={{
        drawerHideStatusBarOnOpen: true,
      }}>
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Home',
          headerTitleAlign: 'center',
          // header: () => <LifeCheck />,
        }}
      />
      <Drawer.Screen
        name="LifeCheckSetup"
        component={LifeCheckSetup}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Life check setup',
          headerTitleAlign: 'center',
        }}
      />
      <Drawer.Screen
        name="LifeCheckHelp"
        component={LifeCheckHelp}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Life check setup',
          headerTitleAlign: 'center',
        }}
      />
      <Drawer.Screen
        name="LifeCheckFrequency"
        component={LifeCheckFrequency}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Life check setup',
          headerTitleAlign: 'center',
        }}
      />
      <Drawer.Screen
        name="SafeOption"
        component={SafeOption}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Safe options',
          headerTitleAlign: 'center',
        }}
      />
      <Drawer.Screen
        name="AutoSharing"
        component={AutoSharing}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Auto sharing setup',
          headerTitleAlign: 'center',
        }}
      />
      <Drawer.Screen
        name="ContactListUpdate"
        component={ContactListUpdate}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Auto sharing setup',
          headerTitleAlign: 'center',
        }}
      />
      <Drawer.Screen name="CreateSafe" component={CreateSafe} />
      <Drawer.Screen
        name="AddItems"
        component={AddItems}
        options={{
          headerTitleAlign: 'center',
        }}
      />
      <Drawer.Screen
        name="TextEditor"
        component={TextEditor}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Text editor',
          headerTitleAlign: 'center',
        }}
      />
      <Drawer.Screen
        name="SavePassword"
        component={SavePassword}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Add password',
          headerTitleAlign: 'center',
        }}
      />
      <Drawer.Screen
        name="AudioRecord"
        component={AudioRecord}
        options={{
          headerTintColor: 'black',
          headerTitle: 'Record audio',
          headerTitleAlign: 'center',
        }}
      />
      <Drawer.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          headerTintColor: 'black',
          headerTitle: 'User profile',
          headerTitleAlign: 'center',
        }}
      />
    </Drawer.Navigator>
  );
};

export default MenuDrawer;

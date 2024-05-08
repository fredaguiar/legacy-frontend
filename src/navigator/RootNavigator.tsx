import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import Home from '../components/home/Home';
import SafeOption from '../components/safe/SafeOption';
import AutoSharingSetup from '../components/safe/AutoSharingSetup';
import AddItems from '../components/safe/AddItems';
import CreateSafe from '../components/safe/CreateSafe';
import useAuthStore from '../store/useAuthStore';
import TextEditor from '../components/safe/TextEditor';

export type PublicRootStackParams = {
  Login: undefined;
  Signup: undefined;
};

export type PrivateRootStackParams = {
  Home: undefined;
  CreateSafe: undefined;
  SafeOption: { safeId: string };
  AutoSharingSetup: { safeId: string };
  AddItems: { itemType: TFileType };
  TextEditor: undefined;
  Tab: undefined;
};

const PublicNativeStackNav = createNativeStackNavigator<PublicRootStackParams>();
const PrivateNativeStackNav = createNativeStackNavigator<PrivateRootStackParams>();

const PublicRootStack = () => (
  <PublicNativeStackNav.Navigator>
    <PublicNativeStackNav.Screen
      name="Login"
      component={Login}
      options={{
        headerTintColor: 'black',
        headerTitle: 'Login',
        headerTitleAlign: 'center',
      }}
    />
    <PublicNativeStackNav.Screen
      name="Signup"
      component={Signup}
      options={{
        headerTintColor: 'black',
        headerTitle: 'Create new profile',
        headerTitleAlign: 'center',
      }}
    />
  </PublicNativeStackNav.Navigator>
);

const PrivateRootStack = () => (
  <PrivateNativeStackNav.Navigator>
    <PrivateNativeStackNav.Screen
      name="Home"
      component={Home}
      options={{
        headerTitleAlign: 'center',
      }}
    />
    <PrivateNativeStackNav.Screen
      name="SafeOption"
      component={SafeOption}
      options={{
        headerTintColor: 'black',
        headerTitle: 'Safe options',
        headerTitleAlign: 'center',
      }}
    />
    <PrivateNativeStackNav.Screen
      name="AutoSharingSetup"
      component={AutoSharingSetup}
      options={{
        headerTintColor: 'black',
        headerTitle: 'Auto sharing setup',
        headerTitleAlign: 'center',
      }}
    />
    <PrivateNativeStackNav.Screen name="CreateSafe" component={CreateSafe} />
    <PrivateNativeStackNav.Screen
      name="AddItems"
      component={AddItems}
      options={{
        presentation: 'modal',
        headerTitleAlign: 'center',
      }}
    />
    <PrivateNativeStackNav.Screen
      name="TextEditor"
      component={TextEditor}
      options={{
        headerTintColor: 'black',
        headerTitle: 'Text editor',
        headerTitleAlign: 'center',
      }}
    />
  </PrivateNativeStackNav.Navigator>
);

const RootNavigator = () => {
  const user = useAuthStore((state) => state.user);
  // console.log('RootNavigator>>>>>>>>>>>>>>>>>> ', user?.password);

  if (!user) {
    return <PublicRootStack />;
  }

  return <PrivateRootStack />;
};

export default RootNavigator;

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import Home from '../components/home/Home';
import SafeOption from '../components/safe/SafeOption';
import AutoSharing from '../components/safe/autoSharing/AutoSharing';
import AddItems from '../components/safe/AddItems';
import CreateSafe from '../components/safe/CreateSafe';
import useAuthStore from '../store/useAuthStore';
import TextEditor from '../components/safe/TextEditor';
import SavePassword from '../components/safe/SavePassword';
import AudioRecord from '../components/safe/AudioRecord';
import ContactListUpdate from '../components/safe/autoSharing/ContactListUpdate';
import LifeCheckSetup from '../components/user/LifeCheckSetup';
import LifeCheckHelp from '../components/user/LifeCheckHelp';
import LifeCheckFrequency from '../components/user/LifeCheckFrequency';

export type PublicRootStackParams = {
  Login: undefined;
  Signup: undefined;
};

export type PrivateRootStackParams = {
  Home: undefined;
  CreateSafe: undefined;
  SafeOption: { safeId: string };
  LifeCheckSetup: undefined;
  LifeCheckHelp: undefined;
  LifeCheckFrequency: undefined;
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
      name="LifeCheckSetup"
      component={LifeCheckSetup}
      options={{
        headerTintColor: 'black',
        headerTitle: 'Life check setup',
        headerTitleAlign: 'center',
      }}
    />
    <PrivateNativeStackNav.Screen
      name="LifeCheckHelp"
      component={LifeCheckHelp}
      options={{
        headerTintColor: 'black',
        headerTitle: 'Life check setup',
        headerTitleAlign: 'center',
      }}
    />
    <PrivateNativeStackNav.Screen
      name="LifeCheckFrequency"
      component={LifeCheckFrequency}
      options={{
        headerTintColor: 'black',
        headerTitle: 'Life check setup',
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
      name="AutoSharing"
      component={AutoSharing}
      options={{
        headerTintColor: 'black',
        headerTitle: 'Auto sharing setup',
        headerTitleAlign: 'center',
      }}
    />
    <PrivateNativeStackNav.Screen
      name="ContactListUpdate"
      component={ContactListUpdate}
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
    <PrivateNativeStackNav.Screen
      name="SavePassword"
      component={SavePassword}
      options={{
        headerTintColor: 'black',
        headerTitle: 'Add password',
        headerTitleAlign: 'center',
      }}
    />
    <PrivateNativeStackNav.Screen
      name="AudioRecord"
      component={AudioRecord}
      options={{
        headerTintColor: 'black',
        headerTitle: 'Record audio',
        headerTitleAlign: 'center',
      }}
    />
  </PrivateNativeStackNav.Navigator>
);

const RootNavigator = () => {
  const user = useAuthStore((state) => state.user);
  console.log('RootNavigator>>>>>>>>>>>>>>>>>> ', user?.firstName);

  if (!user) {
    return <PublicRootStack />;
  }

  return <PrivateRootStack />;
};

export default RootNavigator;

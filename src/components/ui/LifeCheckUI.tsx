import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@rneui/themed';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import SwitchUI from './SwitchUI';
import useAuthStore from '../../store/useAuthStore';
import { updateUserProfileApi } from '../../services/authApi';
import ErrorMessageUI from './ErrorMessageUI';
import SpinnerUI from './SpinnerUI';
import { PrivateRootStackParams } from '../../navigator/RootNavigator';

const LifeCheckUI = ({ currentScreen }: { currentScreen: 'home' | 'setup' }) => {
  const { user } = useAuthStore();
  const updateUser = useAuthStore((state) => state.updateUser);
  const navigation = useNavigation<NavigationProp<PrivateRootStackParams>>();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: updateUserProfileApi,
    onSuccess: (result: TUserUpdate) => {
      updateUser({ fieldsToUpdate: ['lifeCheck'], lifeCheck: result.lifeCheck });
      if (currentScreen === 'home') {
        navigation.navigate('LifeCheckSetup');
      }
    },
  });

  if (isPending) return <SpinnerUI />;

  return (
    <View style={{}}>
      <ErrorMessageUI display={isError} message={error?.message} />
      <Text
        style={{
          fontWeight: '800',
          fontSize: 20,
          marginBottom: 0,
        }}>
        Life check
      </Text>
      <View style={[{ display: 'flex', flexDirection: 'row', alignItems: 'center' }]}>
        <SwitchUI
          on={user?.lifeCheck || false}
          onToggle={(on: boolean) => {
            mutate({
              lifeCheck: on,
              fieldsToUpdate: ['lifeCheck'],
            });
          }}
          disabled={isPending}
        />
        <Text
          style={{
            fontWeight: '800',
            fontSize: 20,
          }}>
          {user?.lifeCheck ? 'On' : 'Off'}
        </Text>
      </View>
    </View>
  );
};

export default LifeCheckUI;

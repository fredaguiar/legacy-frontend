import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@rneui/themed';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import SwitchUI from './SwitchUI';
import useUserStore from '../../store/useUserStore';
import { updateUserProfileApi } from '../../services/authApi';
import ErrorMessageUI from './ErrorMessageUI';
import SpinnerUI from './SpinnerUI';
import { PrivateRootStackParams } from '../../navigator/PrivateStack';

const LifeCheckUI = ({ currentScreen }: { currentScreen: 'home' | 'setup' }) => {
  const { user } = useUserStore();
  const { updateUserLifeCheck } = useUserStore();
  const navigation = useNavigation<NavigationProp<PrivateRootStackParams>>();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: updateUserProfileApi,
    onSuccess: (result: TUserUpdate) => {
      updateUserLifeCheck({ lifeCheck: result.lifeCheck });
      // redirect to Life Check Setup screen if the user it is "on" but schedule has not been configured yet
      if (
        currentScreen === 'home' &&
        result?.lifeCheck.active &&
        result?.lifeCheck.shareTime === undefined
      ) {
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
          on={user?.lifeCheck.active || false}
          onToggle={(on: boolean) => {
            mutate({
              lifeCheck: { active: on },
              fieldsToUpdate: ['lifeCheck.active'],
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

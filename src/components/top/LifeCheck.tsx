import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@rneui/themed';
import SwitchUI from '../ui/SwitchUI';
import useAuthStore from '../../store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { updateUserApi } from '../../services/authApi';
import SpinnerUI from '../ui/SpinnerUI';
import ErrorMessageUI from '../ui/ErrorMessageUI';

const LifeCheck = () => {
  const { user } = useAuthStore();
  const {
    theme: { colors },
  } = useTheme();
  const updateUser = useAuthStore((state) => state.updateUser);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: updateUserApi,
    onSuccess: (result: TUserUpdate) => {
      updateUser({ fieldToUpdate: 'lifeCheck', lifeCheck: result.lifeCheck });
    },
  });

  return (
    <View style={[{ backgroundColor: colors.background2 }]}>
      <ErrorMessageUI display={isError} message={error?.message} />
      <View
        style={[
          {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 4,
          },
        ]}>
        <Text
          style={{
            fontWeight: '800',
            fontSize: 20,
          }}>
          {user?.firstName} {user?.lastName}
        </Text>
        {isPending && <SpinnerUI />}
        <View style={[{}]}>
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
                  fieldToUpdate: 'lifeCheck',
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
      </View>
    </View>
  );
};

export default LifeCheck;

import React from 'react';
import { View, Text } from 'react-native';
import Modal from 'react-native-modal';
import { useMutation } from '@tanstack/react-query';
import { IconButtonsSaveCancel } from '../ui/IconButtons';
import { deleteSafeListApi } from '../../services/safeApi';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import useAuthStore from '../../store/useAuthStore';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { PrivateRootStackParams } from '../../navigator/RootNavigator';

const SafeOptionDeleteSafe = ({
  isVisible,
  onClose,
  safeId,
}: {
  isVisible: boolean;
  onClose: () => void;
  safeId: string;
}) => {
  const deleteSafes = useAuthStore((state) => state.deleteSafes);
  const navigation = useNavigation<NavigationProp<PrivateRootStackParams>>();
  const {
    mutate: mutate,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: deleteSafeListApi,
    onSuccess: ({ safeIdList }: TSafeIdList) => {
      deleteSafes({ safeIdList });
      navigation.navigate('Home');
    },
  });

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View
        style={{
          width: 300,
          height: 200,
          backgroundColor: 'white',
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <ErrorMessageUI display={isError} message={error?.message} />
        <Text style={{ fontSize: 24, marginBottom: 30 }}>Delete safe?</Text>
        <IconButtonsSaveCancel
          typeSave="yes"
          typeCancel="no"
          onPressSave={() => {
            mutate({ safeIdList: [safeId] });
          }}
          onPressCancel={onClose}
          loading={isPending}
        />
      </View>
    </Modal>
  );
};

export default SafeOptionDeleteSafe;

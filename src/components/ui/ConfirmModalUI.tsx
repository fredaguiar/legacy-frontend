import React from 'react';
import { View, Text } from 'react-native';
import Modal from 'react-native-modal';
import { IconButtonsSaveCancel } from './IconButtons';

const ConfirmModalUI = ({
  isVisible,
  onClose,
  onConfirm,
}: {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
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
        <Text style={{ fontSize: 24, marginBottom: 30 }}>Confirm delete?</Text>
        <IconButtonsSaveCancel
          typeSave="yes"
          typeCancel="no"
          onPressSave={onConfirm}
          onPressCancel={onClose}
        />
      </View>
    </Modal>
  );
};

export default ConfirmModalUI;

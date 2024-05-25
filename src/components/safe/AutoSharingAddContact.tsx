import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Input } from '@rneui/themed';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as yup from 'yup';
import { IconButtonsSaveCancel } from '../ui/IconButtons';
import { deleteSafeListApi, updateSafeApi } from '../../services/safeApi';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import useAuthStore from '../../store/useAuthStore';
import { PrivateRootStackParams } from '../../navigator/RootNavigator';
import { Formik } from 'formik';

const emailSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Please enter valid email').required('Email Address is Required'),
});

const phoneSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  phone: yup.string().required('Phone number is required'),
});

const AutoSharingAddContact = ({
  isVisible,
  onClose,
  onAddContactSuccess,
  safeId,
  type,
}: {
  isVisible: boolean;
  onClose: () => void;
  onAddContactSuccess?: (result: TSafeUpdate) => void;
  safeId: string;
  type: 'emails' | 'phones';
}) => {
  const { setContacList } = useAuthStore();
  const navigation = useNavigation<NavigationProp<PrivateRootStackParams>>();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isVisible) {
      setError('');
    }
  }, [isVisible]);

  const { mutate, isPending } = useMutation({
    mutationFn: updateSafeApi,
    onSuccess: onAddContactSuccess,
    onError: (err) => {
      setError(err.message);
    },
  });

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View
        style={{
          width: '100%',
          height: 300,
          backgroundColor: 'white',
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <ErrorMessageUI display={error} message={error} />
        <Formik
          validationSchema={type === 'emails' ? emailSchema : phoneSchema}
          initialValues={{
            name: '',
            email: '',
            phone: '',
          }}
          onSubmit={(values) => {
            mutate({
              _id: safeId,
              fieldToUpdate: type,
              [type]: [
                { name: values.name, contact: type === 'emails' ? values.email : values.phone },
              ],
            });
          }}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={{ width: '100%' }}>
              <Input
                label="Name"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                errorMessage={errors.name && touched.name ? errors.name : undefined}
              />
              {type === 'emails' && (
                <Input
                  label="Email"
                  placeholder="username@email.com"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                  errorMessage={errors.email && touched.email ? errors.email : undefined}
                />
              )}
              {type === 'phones' && (
                <Input
                  label="Phone"
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  value={values.phone}
                  keyboardType="phone-pad"
                  errorMessage={errors.phone && touched.phone ? errors.phone : undefined}
                />
              )}
              <IconButtonsSaveCancel
                typeSave="save"
                typeCancel="cancel"
                onPressSave={handleSubmit}
                onPressCancel={onClose}
                loading={isPending}
              />
            </View>
          )}
        </Formik>
      </View>
    </Modal>
  );
};

export default AutoSharingAddContact;

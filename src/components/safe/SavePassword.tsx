import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Input, useTheme } from '@rneui/themed';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik } from 'formik';
import { IconButtonsSaveCancel } from '../ui/IconButtons';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import useSafeStore from '../../store/useSafeStore';
import useAuthStore from '../../store/useAuthStore';
import KeyboardAvoid from '../../utils/KeyboardAvoid';
import PickerUI from '../ui/PickerUI';
import { PrivateRootStackParams } from '../../navigator/RootNavigator';
import { savePasswordApi } from '../../services/safeApi';
import { SafeUtil } from '../../utils/SafeUtil';

const validationSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  username: yup.string().required('Username is required'),
  password: yup
    .string()
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Confirm password is required'),
});

const SavePassword = ({}: {}) => {
  const [selectedSafeId, setSelectedSafeId] = useState<string>();
  const { safeId } = useSafeStore();
  const { user } = useAuthStore();
  const navigation = useNavigation<NavigationProp<PrivateRootStackParams>>();
  const queryClient = useQueryClient();
  const {
    params: { title, username, password, notes, fileId },
  } = useRoute<RouteProp<PrivateRootStackParams, 'SavePassword'>>();
  const {
    theme: { colors },
  } = useTheme();

  useEffect(() => {
    setSelectedSafeId(SafeUtil.getSafeId({ safeId, user }));
  }, []);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: savePasswordApi,
    onSuccess: (data: boolean) => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      navigation.navigate('Home');
    },
  });

  return (
    <KeyboardAvoid>
      <ScrollView style={{ backgroundColor: colors.background1 }}>
        <View style={{ alignItems: 'center', marginVertical: 10 }}>
          <ErrorMessageUI display={isError} message={error?.message} />
          <MaterialCommunityIcons name="lock-outline" size={50} style={{}} />
        </View>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            title,
            username,
            password,
            confirmPassword: password,
            notes,
          }}
          onSubmit={(values) => {
            mutate({
              title: values.title || '',
              safeId: selectedSafeId || '',
              username: values.username || '',
              password: values.password || '',
              notes: values.notes || '',
              fileId,
            });
          }}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={{ display: 'flex', alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}>Destination safe</Text>
              <PickerUI
                selectedValue={selectedSafeId}
                onValueChange={(val) => {
                  setSelectedSafeId(val as string);
                }}
                items={user?.safes as any}
                style={{ width: 400 }}
              />
              <Input
                label="Tittle (Website, Bank Name, etc)"
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
                errorMessage={errors.title && touched.title ? errors.title : undefined}
              />
              <Input
                label="User Name (Email, number, etc)"
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
                errorMessage={errors.username && touched.username ? errors.username : undefined}
              />
              <Input
                label="Password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry={true}
                errorMessage={errors.password && touched.password ? errors.password : undefined}
              />
              <Input
                label="confirmPassword"
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                value={values.confirmPassword}
                secureTextEntry={true}
                errorMessage={
                  errors.confirmPassword && touched.confirmPassword
                    ? errors.confirmPassword
                    : undefined
                }
              />
              <Text style={{ fontSize: 16 }}>Notes / Other useful info</Text>
              <TextInput
                multiline
                numberOfLines={4}
                onChangeText={handleChange('notes')}
                value={values.notes}
                style={{
                  height: 100,
                  width: 350,
                  textAlignVertical: 'top',
                  borderColor: 'gray',
                  borderWidth: 1,
                  borderRadius: 5,
                  backgroundColor: 'white',
                  marginBottom: 20,
                  fontSize: 22,
                }}
              />
              <IconButtonsSaveCancel
                onPressSave={handleSubmit}
                onPressCancel={() => {
                  navigation.goBack();
                }}
                containerStyle={{}}
                loading={isPending}
              />
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoid>
  );
};

export default SavePassword;
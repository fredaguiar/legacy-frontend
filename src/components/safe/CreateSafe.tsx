import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Divider, Input } from '@rneui/themed';
import * as yup from 'yup';
import { AxiosError } from 'axios';
import LifeCheck from '../top/LifeCheck';
import { Formik } from 'formik';
import { IconButtonsSaveCancel } from '../ui/IconButtons';
import { useNavigation } from '@react-navigation/native';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import { useMutation } from '@tanstack/react-query';
import { createSafeApi } from '../../services/safeApi';
import { TSafe } from '../../typing';
import useSafeStore from '../../store/useSafeStore';
import useAuthStore from '../../store/useAuthStore';

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is Required'),
});

const CreateSafe = ({}: {}) => {
  const addNewSafe = useAuthStore((state) => state.addNewSafe);
  const setSafeId = useSafeStore((state) => state.setSafeId);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createSafeApi,
    onSuccess: (data: TSafe) => {
      addNewSafe(data);
      setSafeId(data._id);
      navigation.goBack();
    },
  });

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <LifeCheck />
      </View>
      <Divider style={{ borderWidth: 1, borderColor: 'gray' }} />
      <View
        style={{
          alignItems: 'center',
          marginTop: 20,
        }}>
        <MaterialCommunityIcons name="treasure-chest" size={50} style={{}} />
        <Text style={{ fontSize: 20 }}>Create new safe</Text>
        <View style={{ marginTop: 20 }}>
          <Formik
            validationSchema={validationSchema}
            initialValues={{ name: '' }}
            onSubmit={(values) => {
              mutate(values.name);
            }}>
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={{ display: 'flex', alignItems: 'center' }}>
                <Input
                  label="Safe name"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  containerStyle={{ width: 350 }}
                  value={values.name}
                  errorMessage={errors.name && touched.name ? errors.name : undefined}
                />
                <ErrorMessageUI display={isError} axiosError={error as AxiosError} />
                <IconButtonsSaveCancel
                  onPressSave={handleSubmit as any}
                  onPressCancel={() => {
                    navigation.goBack();
                  }}
                  loading={isPending}
                />
              </View>
            )}
          </Formik>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerHeader: {
    height: 'auto',
  },
  containerScrollView: {
    flex: 1,
  },
});

export default CreateSafe;

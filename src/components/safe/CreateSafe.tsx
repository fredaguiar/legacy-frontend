import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Divider, Input } from '@rneui/themed';
import * as yup from 'yup';
import LifeCheck from '../header/LifeCheck';
import { Formik } from 'formik';
import { IconButtonsSaveCancel } from '../ui/IconButtons';
import useCreateNewSafe from '../../hooks/useCreateNewSafe';
import { useNavigation } from '@react-navigation/native';
import ErrorMessageUI from '../ui/ErrorMessageUI';

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is Required'),
});

const CreateSafe = ({}: {}) => {
  const { createNewSafe, loading, error } = useCreateNewSafe();
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
              createNewSafe(values.name);
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
                {/* <ErrorMessageUI display={error} message={error?.message} /> */}
                <IconButtonsSaveCancel
                  onPressSave={handleSubmit as any}
                  onPressCancel={() => {
                    navigation.goBack();
                  }}
                  loading={loading}
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

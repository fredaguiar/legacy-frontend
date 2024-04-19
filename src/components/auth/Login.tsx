import { Button, Text, Input } from '@rneui/themed';
import { TouchableOpacity, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import * as yup from 'yup';
import GlobalStyles from '../../styles/GlobalStyles';
import KeyboardAvoid from '../../utils/KeyboardAvoid';
import { PublicRootStackParams } from '../../navigator/RootNavigator';
import { useEffect } from 'react';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import SpinnerUI from '../ui/SpinnerUI';
import { loginApi, testApi } from '../../services/authApi';

const validationSchema = yup.object().shape({
  email: yup.string().email('Please enter valid email').required('Email Address is Required'),
  password: yup
    .string()
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required('Password is required'),
});

const Login = ({}: {}) => {
  const { isPending, isError, error, mutate } = useMutation({ mutationFn: loginApi });

  const navigation = useNavigation<NavigationProp<PublicRootStackParams>>();

  useEffect(() => {
    // logout();
  });

  if (isPending) return <SpinnerUI />;

  return (
    <KeyboardAvoid>
      <View
        style={[GlobalStyles.AndroidSafeArea, GlobalStyles.SkyBackground, GlobalStyles.Container]}>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            email: 'a@gmail.com',
            password: '11111111',
          }}
          onSubmit={(values) => {
            // mutate({ email: values.email, password: values.password });
            testApi();
          }}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View>
              <Input
                label="Email"
                placeholder="username@email.com"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
                errorMessage={errors.email && touched.email ? errors.email : undefined}
              />
              <Input
                label="Password"
                placeholder="Password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry={true}
                errorMessage={errors.password && touched.password ? errors.password : undefined}
              />
              <ErrorMessageUI display={isError} message={error?.stack} />
              <View style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  onPress={handleSubmit as any}
                  title="Login"
                  containerStyle={{ width: 300, marginBottom: 20 }}
                />
                <TouchableOpacity
                  onPress={() => navigation.navigate('Signup')}
                  style={{ marginBottom: 40 }}>
                  <Text style={{ textDecorationLine: 'underline', fontSize: 20 }}>
                    Not a member yet? Sign up.
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoid>
  );
};

export default Login;

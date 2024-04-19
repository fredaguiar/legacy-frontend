import { Text } from '@rneui/themed';
import { AxiosError } from 'axios';
import { View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type TErrorMessageUI = { message?: string; display: any; axiosError?: AxiosError<any> };

const ErrorMessageUI = ({ message, display, axiosError }: TErrorMessageUI) => {
  if (display) {
    console.log('axiosError?.response?.data', axiosError?.response?.data.message);
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <MaterialCommunityIcons
          name="alert-circle"
          size={30}
          color="red"
          style={{
            marginRight: 10,
          }}
        />
        <Text style={{ color: 'red' }}>{message || axiosError?.response?.data.message}</Text>
      </View>
    );
  }
  return <></>;
};

export default ErrorMessageUI;

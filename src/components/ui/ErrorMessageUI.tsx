import { Text } from '@rneui/themed';
import { View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ErrorMessageUI = ({ message, display }: { message: string | undefined; display: any }) => {
  if (display)
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
        <Text style={{ color: 'red' }}>{message}</Text>
      </View>
    );
  return <></>;
};

export default ErrorMessageUI;

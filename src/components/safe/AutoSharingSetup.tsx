import { StyleSheet, View } from 'react-native';
import { Text } from '@rneui/themed';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { PrivateRootStackParams } from '../../navigator/RootNavigator';

const AutoSharingSetup = () => {
  const {
    params: { safeId },
  } = useRoute<RouteProp<PrivateRootStackParams, 'SafeOption'>>();

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontWeight: '800',
          fontSize: 20,
          marginRight: 10,
        }}>
        Auto Sharing Setup
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(197, 197, 197)',
  },
  dropDown: {
    backgroundColor: 'white',
    width: 350,
  },
});

export default AutoSharingSetup;

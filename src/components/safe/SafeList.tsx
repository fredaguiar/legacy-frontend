import { FlatList, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { PrivateRootStackParams } from '../../navigator/RootNavigator';
import useAuthStore from '../../store/useAuthStore';
import useSafeStore from '../../store/useSafeStore';

const SafeItem = ({
  safeName,
  safeId,
  navigation,
}: {
  safeName: string;
  safeId: string;
  navigation: NavigationProp<PrivateRootStackParams>;
}) => {
  const setSafeId = useSafeStore((state) => state.setSafeId);
  const {
    theme: { colors },
  } = useTheme();
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          alignItems: 'center',
          borderWidth: 1,
          backgroundColor: colors.row1,
          borderRadius: 10,
          margin: 5,
        }}
        onPress={() => {
          setSafeId(safeId);
        }}>
        <MaterialCommunityIcons name="treasure-chest" size={50} style={{ marginHorizontal: 5 }} />
        <Text style={{ maxWidth: '70%' }}>{safeName}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('SafeOption', { safeId });
        }}>
        <MaterialCommunityIcons name="dots-horizontal" size={50} style={{ marginHorizontal: 5 }} />
      </TouchableOpacity>
    </View>
  );
};

const SafeList = () => {
  const user = useAuthStore((state) => state.user);
  const navigation = useNavigation<NavigationProp<PrivateRootStackParams>>();

  return (
    <View style={{}}>
      <FlatList
        data={user?.safes}
        renderItem={({ item }) => (
          <SafeItem safeName={item.name} safeId={item._id} navigation={navigation} />
        )}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default SafeList;

import { FlatList, View } from 'react-native';
import { Text, useTheme } from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeUtil } from '../../utils/SafeUtil';
import { FileTypeUtil } from '../../utils/FileTypeUtil';
import { TITem } from '../../typing';
import useAuthStore from '../../store/useAuthStore';
import useSafeStore from '../../store/useSafeStore';

const Item = ({ item }: { item: TITem }) => {
  const {
    theme: { colors },
  } = useTheme();
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.divider1,
      }}>
      <MaterialCommunityIcons
        name={FileTypeUtil.getFileTypeIcon(item.type)}
        size={50}
        style={{ marginHorizontal: 5 }}
      />
      <Text style={{ flexGrow: 1 }}>{item.name}</Text>
    </View>
  );
};

const ItemList = () => {
  const user = useAuthStore((state) => state.user);
  const safe = SafeUtil.getSafe(
    user,
    useSafeStore((state) => state.safeId)
  );

  return (
    <View>
      <FlatList
        data={safe?.items}
        renderItem={({ item }) => <Item item={item} />}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default ItemList;

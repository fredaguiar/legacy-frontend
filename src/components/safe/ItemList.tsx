import { FlatList, View } from 'react-native';
import { Text, useTheme } from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeUtil } from '../../utils/SafeUtil';
import { FileTypeUtil } from '../../utils/FileTypeUtil';
import { TFileInfo, TFileInfoListResult, TITem } from '../../typing';
import useAuthStore from '../../store/useAuthStore';
import useSafeStore from '../../store/useSafeStore';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import SpinnerUI from '../ui/SpinnerUI';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import { getFileInfoListApi } from '../../services/safeApi';

const Item = ({ fileInfo }: { fileInfo: TFileInfo }) => {
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
      {/* <MaterialCommunityIcons
        name={FileTypeUtil.getFileTypeIcon(item.type)}
        size={50}
        style={{ marginHorizontal: 5 }}
      /> */}
      <Text style={{ flexGrow: 1 }}>{fileInfo.name}</Text>
    </View>
  );
};

const ItemList = () => {
  const { user } = useAuthStore();
  const { safeId } = useSafeStore();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['files'],
    queryFn: () => getFileInfoListApi(safeId as string),
  });

  if (isPending) return <SpinnerUI />;

  return (
    <View>
      <ErrorMessageUI display={isError} message={error?.message} />
      <FlatList
        data={data?.fileInfoList}
        renderItem={({ item }) => <Item fileInfo={item} />}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default ItemList;

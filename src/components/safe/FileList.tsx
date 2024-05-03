import { FlatList, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FileTypeUtil } from '../../utils/FileTypeUtil';
import useSafeStore from '../../store/useSafeStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import SpinnerUI from '../ui/SpinnerUI';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import { downloadFilesApi, getFileInfoListApi } from '../../services/uploadFilesApi';

const FileInfo = ({ fileInfo }: { fileInfo: TFileInfo }) => {
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
        name={FileTypeUtil.getFileTypeIcon(fileInfo.mimetype)}
        size={50}
        style={{ marginHorizontal: 5 }}
      />
      <Text style={{ flexGrow: 2 }}>{fileInfo.filename}</Text>
      <Text style={{ flexGrow: 1 }}>{fileInfo.length}</Text>
    </View>
  );
};

const FileList = () => {
  const { safeId } = useSafeStore();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['files'],
    queryFn: () => getFileInfoListApi(safeId as string),
  });

  const {
    mutate,
    isPending: isPendingDownload,
    isError: isErrorDownload,
    error: errorDownload,
  } = useMutation({ mutationFn: downloadFilesApi });

  const renderItem = ({ item }: { item: TFileInfo }) => (
    <TouchableOpacity
      onPress={() => {
        mutate({ fileId: item.id, filename: item.filename, safeId: safeId as string });
      }}>
      <FileInfo fileInfo={item} />
    </TouchableOpacity>
  );

  if (isPending || isPendingDownload) return <SpinnerUI />;

  return (
    <View>
      <ErrorMessageUI
        display={isError || isErrorDownload}
        message={error?.message || errorDownload?.message}
      />
      <FlatList
        data={data?.fileInfoList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default FileList;

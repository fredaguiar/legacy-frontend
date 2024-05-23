import { FlatList, TouchableOpacity, View } from 'react-native';
import { Text, makeStyles, useTheme } from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import FileViewer from 'react-native-file-viewer';
import { FileTypeUtil } from '../../utils/FileTypeUtil';
import useSafeStore from '../../store/useSafeStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import SpinnerUI from '../ui/SpinnerUI';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import { downloadFilesApi, getFileInfoListApi } from '../../services/filesApi';
import { useState } from 'react';
import { PrivateRootStackParams } from '../../navigator/RootNavigator';
import { getPasswordApi } from '../../services/safeApi';

const formatBytes = (bytes: number) => {
  //  GridFS length is stored in bytes
  if (bytes < 1024) return '1 KB';
  return `${(bytes / 1024).toFixed(2)} KB`;
};

const formatDate = (date: Date) => {
  return moment().format('MMMM DD, YYYY h:mm a');
};

const FileInfo = ({ fileInfo }: { fileInfo: TFileInfo }) => {
  const {
    theme: { colors },
  } = useTheme();
  const styles = useStyles();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.divider1,
        paddingVertical: 10,
      }}>
      <MaterialCommunityIcons
        name={FileTypeUtil.getFileTypeIcon(fileInfo.mimetype)}
        size={50}
        style={{ marginHorizontal: 4 }}
      />
      <View>
        <Text style={{ width: 350 }}>{fileInfo.filename}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.fileInfo}>{formatBytes(fileInfo.length)}</Text>
          <Text style={[styles.fileInfo, { marginEnd: 12 }]}>
            {FileTypeUtil.getFileTypeSimple(fileInfo.mimetype)}
          </Text>
          <Text style={[styles.fileInfo, { marginEnd: 12 }]}>
            {formatDate(fileInfo.uploadDate)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const FileList = () => {
  const { safeId } = useSafeStore();
  const queryClient = useQueryClient(); // Get access to the query client
  const [error, setError] = useState<string>();
  const navigation = useNavigation<NavigationProp<PrivateRootStackParams>>();

  const {
    data,
    isPending: isPendingList,
    isError: isErrorList,
    error: errorList,
  } = useQuery({
    queryKey: ['files'],
    queryFn: () => getFileInfoListApi(safeId as string),
  });

  const {
    mutate: mutateDownload,
    isPending: isPendingDownload,
    isError: isErrorDownload,
    error: errorDownload,
  } = useMutation({
    mutationFn: downloadFilesApi,
    onSuccess: async (result) => {
      try {
        // TODO: text/html could not be related to TextEditor
        if (result.mimetype === 'text/html') {
          navigation.navigate('TextEditor', {
            fileId: result.fileId,
            title: result.filename,
            localFilePath: result.localFilePath,
          });
          return;
        }
        if (result.mimetype.startsWith('audio/')) {
          navigation.navigate('AudioRecord', {
            fileId: result.fileId,
            title: result.filename,
            localFilePath: result.localFilePath,
            mode: 'audio',
          });
          return;
        }
        await FileViewer.open(result.localFilePath, { showAppsSuggestions: true });
      } catch (error: any) {
        setError('File could not be open');
      }
    },
  });

  const {
    mutate: mutatePass,
    isPending: isPendingPass,
    isError: isErrorPass,
    error: errorPass,
  } = useMutation({
    mutationFn: getPasswordApi,
    onSuccess: async (result) => {
      try {
        navigation.navigate('SavePassword', {
          title: result.title,
          username: result.username,
          password: result.password,
          notes: result.notes,
          safeId: safeId as string,
          fileId: result.fileId,
        });
      } catch (error: any) {
        setError('File could not be open');
      }
    },
  });

  const renderItem = ({ item }: { item: TFileInfo & TPassword }) => (
    <TouchableOpacity
      onPress={() => {
        setError(undefined);
        if (item.mimetype === 'text/pass') {
          mutatePass({
            fileId: item.id,
            safeId: safeId as string,
          });
          return;
        }
        mutateDownload({
          fileId: item.id,
          filename: item.filename,
          safeId: safeId as string,
          mimetype: item.mimetype,
        });
      }}>
      <FileInfo fileInfo={item} />
    </TouchableOpacity>
  );

  if (isPendingList || isPendingDownload || isPendingPass) return <SpinnerUI />;

  return (
    <View>
      <ErrorMessageUI
        display={error || isErrorDownload || isErrorList || isErrorPass}
        message={error || errorDownload?.message || errorList?.message || errorPass?.message}
      />
      <FlatList
        data={data?.fileInfoList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const useStyles = makeStyles((theme, props: {}) => ({
  fileInfo: {
    fontSize: 16,
    color: theme.colors.text2,
  },
}));

export default FileList;

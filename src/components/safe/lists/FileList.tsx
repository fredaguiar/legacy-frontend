import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Text, makeStyles, useTheme } from '@rneui/themed';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useSafeStore from '../../../store/useSafeStore';
import useDownloadFiles from './useDownloadFiles';
import { FileTypeUtil } from '../../../utils/FileTypeUtil';
import { getFileInfoListApi } from '../../../services/filesApi';
import SpinnerUI from '../../ui/SpinnerUI';
import ErrorMessageUI from '../../ui/ErrorMessageUI';

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
        <Text style={{ width: 350 }}>{fileInfo.fileName}</Text>
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
  const { renderFileItem, errorDownload, isPendingDownload } = useDownloadFiles();

  const {
    data,
    isPending: isPendingList,
    isError: isErrorList,
    error: errorList,
  } = useQuery({
    queryKey: ['files'],
    queryFn: () => getFileInfoListApi(safeId as string),
  });

  if (isPendingList || isPendingDownload) return <SpinnerUI />;

  return (
    <View>
      <ErrorMessageUI display={errorDownload} message={errorDownload} />
      <ErrorMessageUI display={isErrorList} message={errorList?.message} />

      <FlatList
        data={data?.fileInfoList}
        renderItem={({ item }) => renderFileItem({ item, fileInfo: <FileInfo fileInfo={item} /> })}
        keyExtractor={(item) => item._id}
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

import { FlatList, View } from 'react-native';
import { Divider, Text, makeStyles, useTheme } from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import useSearchStore from '../../../store/useSearchStore';
import SpinnerUI from '../../ui/SpinnerUI';
import SafeInfo from './SafeInfo';
import { MenuDrawerParams } from '../../../navigator/MenuDrawer';
import useDownloadFiles from './useDownloadFiles';
import { FileTypeUtil } from '../../../utils/FileTypeUtil';

const FileSearchResultInfo = ({ fileInfo }: { fileInfo: TFileInfo }) => {
  const {
    theme: { colors },
  } = useTheme();
  const styles = useStyles();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',

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
          <Text style={[styles.fileInfo, { marginEnd: 12 }]}>
            {FileTypeUtil.getFileTypeSimple(fileInfo.mimetype)}
          </Text>
          <Text style={[styles.fileInfo, { marginEnd: 12 }]}></Text>
        </View>
      </View>
    </View>
  );
};

const SearchSafesResult = () => {
  const { searchResult } = useSearchStore();
  const { renderFileItem, errorDownload, isPendingDownload } = useDownloadFiles();
  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();
  const {
    theme: { colors },
  } = useTheme();

  console.log('SearchSafesResult SEARCH RESULT:', JSON.stringify(searchResult));

  if (!searchResult) return <SpinnerUI />;

  const renderItem = ({ item }: { item: TSafe }) => (
    <View>
      {item.files?.map((file) =>
        renderFileItem({ item: file, fileInfo: <FileSearchResultInfo fileInfo={file} /> }),
      )}
      <SafeInfo safeName={item.name || ''} safeId={item._id || ''} navigation={navigation} />
      <Divider style={{ marginVertical: 10, borderWidth: 2, borderColor: colors.divider2 }} />
    </View>
  );

  return (
    <View>
      <FlatList
        data={searchResult}
        renderItem={renderItem}
        keyExtractor={(item) => item._id as string}
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

export default SearchSafesResult;

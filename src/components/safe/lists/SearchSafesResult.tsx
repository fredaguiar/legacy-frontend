import { FlatList, View } from 'react-native';
import { Divider, Text, makeStyles, useTheme } from '@rneui/themed';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import useSearchStore from '../../../store/useSearchStore';
import SpinnerUI from '../../ui/SpinnerUI';
import SafeInfo from './SafeInfo';
import { MenuDrawerParams } from '../../../navigator/MenuDrawer';
import useDownloadFiles from './useDownloadFiles';
import ErrorMessageUI from '../../ui/ErrorMessageUI';
import FileInfo from './FileInfo';
import HighlightedTextUI from '../../ui/SelectTextUI';

const SearchSafesResult = () => {
  const { searchResult } = useSearchStore();
  const { renderFileItem, errorDownload, isPendingDownload } = useDownloadFiles();
  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();
  const styles = useStyles();
  const {
    theme: { colors },
  } = useTheme();

  console.log('SearchSafesResult SEARCH RESULT:', JSON.stringify(searchResult));
  console.log('item.searchMatch SEARCH RESULT:', JSON.stringify(searchResult));

  if (!searchResult || isPendingDownload) return <SpinnerUI />;
  if (errorDownload) return <ErrorMessageUI display={errorDownload} message={errorDownload} />;

  const renderItem = ({ item }: { item: TSafe }) => (
    <View>
      {item.files?.map((file) =>
        renderFileItem({
          item: file,
          fileInfo: <FileInfo fileInfo={file} style={{ marginBottom: 10 }} />,
        }),
      )}
      <SafeInfo safeName={item.name || ''} safeId={item._id || ''} navigation={navigation} />
      {item.searchMatch && item.searchValue && (
        <HighlightedTextUI
          text={item.searchMatch}
          highlightedText={item.searchValue}
          style={styles.fontStyles}
          highlightedTextStyle={[styles.fontStyles, { color: 'red' }]}
        />
      )}
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
  fontStyles: {
    fontSize: 16,
    color: theme.colors.text2,
  },
}));

export default SearchSafesResult;

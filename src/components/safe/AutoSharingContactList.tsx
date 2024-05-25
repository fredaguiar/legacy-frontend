import { FlatList, TouchableOpacity, View } from 'react-native';
import { Text, makeStyles, useTheme } from '@rneui/themed';

const ContactInfo = ({ fileInfo }: { fileInfo: TContactInfo }) => {
  const {
    theme: { colors },
  } = useTheme();
  const styles = useStyles();

  console.log(fileInfo);

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.divider1,
        backgroundColor: colors.background,
        padding: 5,
      }}>
      <Text style={styles.fileInfo}>{fileInfo.name}</Text>
      <Text style={styles.fileInfo}>{fileInfo.contact}</Text>
    </View>
  );
};

const AutoSharingContactList = ({
  contactList,
  type,
}: {
  contactList: TContactInfo[];
  type: TContactInfoType;
}) => {
  const {
    theme: { colors },
  } = useTheme();

  const renderItem = ({ item }: { item: TContactInfo }) => (
    <TouchableOpacity onPress={() => {}}>
      <ContactInfo fileInfo={item} />
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.divider1,
        width: '100%',
      }}>
      {!contactList || contactList.length === 0 ? (
        <Text>No {type} added</Text>
      ) : (
        <FlatList
          data={contactList}
          renderItem={renderItem}
          keyExtractor={(item) => item._id || ''}
        />
      )}
    </View>
  );
};

const useStyles = makeStyles((theme, props: {}) => ({
  fileInfo: {
    fontSize: 20,
    color: theme.colors.text1,
  },
}));

export default AutoSharingContactList;

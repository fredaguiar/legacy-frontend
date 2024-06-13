import { View } from 'react-native';
import { Button, Text, makeStyles, useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { PrivateRootStackParams } from '../../navigator/PrivateStack';
import useAuthStore from '../../store/useAuthStore';

const Bottom = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<PrivateRootStackParams, 'CreateSafe'>>();
  const styles = useStyles({});
  const setUser = useAuthStore((state) => state.setUser);
  const {
    theme: { colors },
  } = useTheme();

  const goTo = (itemType: TFileType) => {
    navigation.navigate('AddItems', { itemType });
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 5,
          marginBottom: 10,
        }}>
        <ButtonAddItem
          onPress={() => {
            navigation.navigate('CreateSafe');
          }}
          title="Create new safe"
          width={200}
          icon={
            <MaterialCommunityIcons name="treasure-chest" size={30} style={{ marginRight: 5 }} />
          }
        />
        <ButtonAddItem
          onPress={() => {
            setUser(undefined);
          }}
          title="Logout"
          width={100}
        />
      </View>
      <Text style={{ fontWeight: 'bold' }}>Add new item:</Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 5,
        }}>
        <ButtonAddItem
          onPress={() => goTo('photo')}
          color={colors.secondary}
          title="Photo"
          icon={
            <MaterialCommunityIcons name="camera-outline" size={30} style={{ marginRight: 5 }} />
          }
        />
        <ButtonAddItem
          onPress={() => goTo('video')}
          color={colors.secondary}
          title="Video"
          icon={
            <MaterialCommunityIcons name="video-outline" size={30} style={{ marginRight: 5 }} />
          }
        />
        <ButtonAddItem
          onPress={() => goTo('audio')}
          color={colors.secondary}
          title="Audio"
          icon={
            <MaterialCommunityIcons
              name="microphone-outline"
              size={30}
              style={{ marginRight: 5 }}
            />
          }
        />
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 5,
        }}>
        <ButtonAddItem
          onPress={() => goTo('text')}
          color={colors.secondary}
          title="Text"
          icon={
            <MaterialCommunityIcons name="note-text-outline" size={30} style={{ marginRight: 5 }} />
          }
        />
        <ButtonAddItem
          onPress={() => goTo('file')}
          color={colors.secondary}
          title="File"
          icon={
            <MaterialCommunityIcons
              name="file-document-outline"
              size={30}
              style={{ marginRight: 5 }}
            />
          }
        />
        <ButtonAddItem
          onPress={() =>
            navigation.navigate('SavePassword', {
              fileId: '',
              safeId: '',
              title: '',
              username: '',
              password: '',
              notes: '',
            })
          }
          color={colors.secondary}
          title="Password"
          icon={<MaterialCommunityIcons name="lock-outline" size={30} style={{ marginRight: 5 }} />}
        />
      </View>
    </View>
  );
};

const ButtonAddItem = ({
  onPress,
  title,
  width,
  color,
  icon,
}: {
  onPress: () => void;
  title: string;
  width?: number;
  color?: string;
  icon?: React.ReactElement;
}) => {
  return (
    <Button
      onPress={onPress}
      title={title}
      color={color}
      containerStyle={{ margin: 5, width: width ? width : 125 }}
      radius="5"
      titleStyle={{
        color: 'black',
        fontWeight: 'normal',
        fontSize: 18,
      }}
      icon={icon}
    />
  );
};

const useStyles = makeStyles((theme, props: {}) => ({
  container: {
    height: 250,
    backgroundColor: theme.colors.background2,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default Bottom;

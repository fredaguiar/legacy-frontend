import { Text } from '@rneui/themed';
import { TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type TIconButton = 'save' | 'cancel';
type TIconButtonValues = { label: string; iconName: string };
const iconButtonMap: Record<TIconButton, TIconButtonValues> = {
  save: {
    label: 'Save',
    iconName: 'checkbox-outline',
  },
  cancel: {
    label: 'Cancel',
    iconName: 'cancel',
  },
};

const IconButton = ({
  onPress,
  style,
  disabled,
  loading,
  type,
}: {
  onPress?: () => void;
  style?: object;
  disabled?: boolean;
  loading?: boolean;
  type: TIconButton;
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginBottom: 40 }}>
      <View style={{ alignItems: 'center' }}>
        <MaterialCommunityIcons
          name={iconButtonMap[type].iconName}
          size={50}
          style={style}
          disabled={disabled || loading}
        />
        <Text>{iconButtonMap[type].label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const IconButtonsSaveCancel = ({
  onPressSave,
  onPressCancel,
  disabled,
  loading,
}: {
  onPressSave?: () => void;
  onPressCancel?: () => void;
  style?: object;
  disabled?: boolean;
  loading?: boolean;
}) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
      }}>
      <IconButton onPress={onPressCancel} disabled={disabled || loading} type="cancel" />
      <IconButton onPress={onPressSave} disabled={disabled || loading} type="save" />
    </View>
  );
};

export { IconButton, IconButtonsSaveCancel };

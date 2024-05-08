import { Text } from '@rneui/themed';
import { StyleProp, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
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
  containerStyle,
  disabled,
  loading,
  type,
  size,
}: {
  onPress?: () => void;
  style?: object;
  containerStyle?: object;
  disabled?: boolean;
  loading?: boolean;
  type: TIconButton;
  size?: number;
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={containerStyle} disabled={disabled || loading}>
      <View style={{ alignItems: 'center' }}>
        <MaterialCommunityIcons
          name={iconButtonMap[type].iconName}
          size={size || 30}
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
  containerStyle,
  disabled,
  loading,
  size,
}: {
  onPressSave?: () => void;
  onPressCancel?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  loading?: boolean;
  size?: number;
}) => {
  return (
    <View
      style={[
        {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: '100%',
        },
        containerStyle,
      ]}>
      <IconButton
        onPress={onPressCancel}
        disabled={disabled || loading}
        type="cancel"
        size={size}
      />
      <IconButton onPress={onPressSave} disabled={disabled || loading} type="save" size={size} />
    </View>
  );
};

const SmallButtonSaveCancel = ({
  onPressSave,
  onPressCancel,
  containerStyle,
  disabled,
  loading,
  style,
}: {
  onPressSave?: () => void;
  onPressCancel?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<TextStyle>;
  disabled?: boolean;
  loading?: boolean;
}) => {
  return (
    <View
      style={[
        {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: '100%',
        },
        containerStyle,
      ]}>
      <SmallButton
        onPress={onPressCancel}
        disabled={disabled || loading}
        type="cancel"
        style={style}
      />
      <SmallButton onPress={onPressSave} disabled={disabled || loading} type="save" style={style} />
    </View>
  );
};

const SmallButton = ({
  onPress,
  style,
  containerStyle,
  disabled,
  loading,
  type,
}: {
  onPress?: () => void;
  style?: StyleProp<TextStyle>;
  containerStyle?: object;
  disabled?: boolean;
  loading?: boolean;
  type: TIconButton;
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={containerStyle} disabled={disabled || loading}>
      <Text style={style}>{iconButtonMap[type].label}</Text>
    </TouchableOpacity>
  );
};

export { IconButton, IconButtonsSaveCancel, SmallButton, SmallButtonSaveCancel };

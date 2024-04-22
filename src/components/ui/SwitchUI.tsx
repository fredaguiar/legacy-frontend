import { Switch, useTheme } from '@rneui/themed';
import { useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

type TSwitchProps = {
  on: boolean;
  onToggle: (val: boolean) => void;
  style?: StyleProp<ViewStyle>;
};

const SwitchUI = ({ on = false, onToggle, style }: TSwitchProps) => {
  const [isEnabled, setIsEnabled] = useState(on);
  const {
    theme: { colors },
  } = useTheme();

  return (
    <Switch
      style={style}
      trackColor={{ false: colors.input2, true: colors.input2 }}
      thumbColor={isEnabled ? colors.highlight : colors.disabled}
      value={isEnabled}
      onValueChange={() => {
        setIsEnabled((previousState) => !previousState);
        onToggle(!isEnabled);
      }}
    />
  );
};

export default SwitchUI;

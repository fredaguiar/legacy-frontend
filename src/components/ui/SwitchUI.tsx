import { Switch, useTheme } from '@rneui/themed';
import { useState } from 'react';

const SwitchUI = ({ on = false, onToggle }: { on: boolean; onToggle: (val: boolean) => void }) => {
  const [isEnabled, setIsEnabled] = useState(on);
  const {
    theme: { colors },
  } = useTheme();

  return (
    <Switch
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

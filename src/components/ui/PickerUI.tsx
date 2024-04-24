import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import { StyleProp, TextStyle } from 'react-native';

export type TPickerItem = {
  _id: string;
  name: string;
  label: string;
  value: string;
};

type TPickerUIProps = {
  selectedValue?: string;
  onValueChange: (itemValue: string | number) => void;
  items: Array<TPickerItem>;
  style?: StyleProp<TextStyle>;
};

const PickerUI: React.FC<TPickerUIProps> = ({ selectedValue, onValueChange, items, style }) => {
  const [selected, setSelected] = useState(selectedValue);
  const {
    theme: { colors },
  } = useTheme();

  return (
    <Picker
      style={[
        {
          marginVertical: 20,
          backgroundColor: colors.input1,
          height: 65,
          width: 200,
        },
        style,
      ]}
      selectedValue={selected}
      onValueChange={(val: string) => {
        setSelected(val);
        onValueChange(val);
      }}
      mode="dropdown">
      {items.map((item: TPickerItem) => (
        <Picker.Item
          key={item._id || item.value}
          label={item.name || item.label}
          value={item._id || item.value}
          style={{ fontSize: 22 }}
        />
      ))}
    </Picker>
  );
};

export default PickerUI;

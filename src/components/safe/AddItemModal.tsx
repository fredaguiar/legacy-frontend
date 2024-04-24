import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, useTheme } from '@rneui/themed';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { PrivateRootStackParams } from '../../navigator/RootNavigator';
import { capitalizeFirstLetter } from '../../utils/StringUtil';
import useImportItem from '../../hooks/useImportItem';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import SpinnerUI from '../ui/SpinnerUI';
import { TItemTypeMap } from '../../typing';
import PickerUI from '../ui/PickerUI';
import useAuthStore from '../../store/useAuthStore';
import useSafeStore from '../../store/useSafeStore';

const AddItemModal = ({}: {}) => {
  const {
    params: { itemType },
  } = useRoute<RouteProp<PrivateRootStackParams, 'AddItemModal'>>();
  const navigation = useNavigation<NavigationProp<PrivateRootStackParams>>();
  const { user } = useAuthStore();
  const { safeId, setSafeId } = useSafeStore();
  const [selectedSafeId, setSelectedSafeId] = useState<string>();
  const { importItem, data, isPending, error } = useImportItem();

  const {
    theme: { colors },
  } = useTheme();

  const { label, iconName } = TItemTypeMap[itemType];

  useEffect(() => {
    navigation.setOptions({
      title: capitalizeFirstLetter(label),
    });
    if (!safeId && user?.safes && user?.safes.length > 0) {
      setSelectedSafeId(user.safes[0]._id);
      return;
    }
    if (safeId) {
      setSelectedSafeId(safeId);
      return;
    }
    if (data) navigation.navigate('Home');
  }, [data]);

  if (isPending) return <SpinnerUI />;

  console.log('AddItemModal safeId:', safeId);

  return (
    <View style={{ backgroundColor: colors.background2 }}>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <MaterialCommunityIcons
          name={iconName}
          size={50}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Text style={{ fontSize: 20, marginBottom: 20 }}>Add {label} </Text>
        <View
          style={{
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 20,
          }}>
          <Text style={{ fontSize: 20 }}>Destination safe</Text>
          <PickerUI
            selectedValue={selectedSafeId}
            onValueChange={(val) => {
              setSelectedSafeId(val as string);
            }}
            items={user?.safes as any}
            style={{ width: 400 }}
          />
        </View>

        <View
          style={{
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <ErrorMessageUI display={error} message={error} />
          <ButtonImport
            onPress={() => {
              setSafeId(selectedSafeId);
              importItem();
            }}
            title="Import from phone"
          />
          <ButtonImport onPress={() => {}} title="Take picture" />
        </View>

        <View style={{ alignItems: 'center' }}>
          <MaterialCommunityIcons
            name="close-circle"
            size={50}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
      </View>
    </View>
  );
};

const ButtonImport = ({
  onPress,
  title,
  width,
}: {
  onPress: () => void;
  title: string;
  width?: number;
}) => {
  const {
    theme: { colors },
  } = useTheme();
  return (
    <Button
      onPress={onPress}
      title={title}
      color={colors.primary}
      containerStyle={{ margin: 5, width: width ? width : 200 }}
      radius="5"
      titleStyle={{
        color: 'black',
        fontWeight: 'normal',
      }}
    />
  );
};

export default AddItemModal;

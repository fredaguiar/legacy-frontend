import { TextInput, View } from 'react-native';
import { Button, Text, useTheme } from '@rneui/themed';
import * as yup from 'yup';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { PrivateRootStackParams } from '../../navigator/RootNavigator';
import { useState } from 'react';
import { IconButtonsSaveCancel } from '../ui/IconButtons';
import { Formik } from 'formik';
import useUpdateSafeOptions from '../../hooks/useUpdateSafeOptions';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import StorageUsage from '../ui/StorageUsage';
import SwitchUI from '../ui/SwitchUI';
import PickerUI from '../ui/PickerUI';
import useAuthStore from '../../store/useAuthStore';

const validationSchema = yup.object().shape({});

const SafeOption = () => {
  const {
    params: { safeId },
  } = useRoute<RouteProp<PrivateRootStackParams, 'SafeOption'>>();
  const user = useAuthStore((state) => state.user);
  const [autoSharing, setAutoSharing] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedSafeId, setSelectedSafeId] = useState(safeId);
  const { updateSafeOptions, loading, error } = useUpdateSafeOptions();
  const navigation = useNavigation<NavigationProp<PrivateRootStackParams>>();
  const {
    theme: { colors },
  } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background1 }}>
      <Formik
        validationSchema={validationSchema}
        initialValues={{ name: '' }}
        onSubmit={(values) => {}}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View
            style={{
              alignItems: 'center',
              marginTop: 20,
              marginBottom: 20,
            }}>
            <PickerUI
              selectedValue={selectedSafeId}
              onValueChange={(val: string | number) => {
                setSelectedSafeId(val as string);
              }}
              items={user?.safes as any}
            />
            <View style={[{ display: 'flex', flexDirection: 'row', marginBottom: 20 }]}>
              <Text
                style={{
                  fontWeight: '800',
                  fontSize: 20,
                  marginRight: 10,
                }}>
                Auto-sharing:
              </Text>
              <SwitchUI
                on={false}
                onToggle={(on: boolean) => {
                  setAutoSharing(on);
                }}
              />
              <Text
                style={{
                  fontWeight: '800',
                  fontSize: 20,
                }}>
                {autoSharing ? 'On' : 'Off'}
              </Text>
            </View>
            <View
              style={{
                marginBottom: 20,
              }}>
              <ButtonSafe
                onPress={() => {
                  navigation.navigate('AutoSharingSetup', { safeId });
                }}
                title="Auto-sharing setup"
                iconName="share-variant-outline"
              />
            </View>

            <TextInput
              multiline
              numberOfLines={4}
              onChangeText={setDescription}
              value={description}
              style={{
                height: 100,
                width: 350,
                textAlignVertical: 'top',
                borderColor: 'gray',
                borderWidth: 1,
                borderRadius: 5,
                backgroundColor: 'white',
                marginBottom: 20,
                fontSize: 22,
              }}
            />
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
              }}>
              <ButtonSafe onPress={() => {}} title="Rename safe" iconName="lead-pencil" />
              <ButtonSafe onPress={() => {}} title="Delete safe" iconName="delete-outline" />
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
              }}>
              {/* <ErrorMessageUI display={error} message={error?.message} /> */}
              <IconButtonsSaveCancel
                onPressSave={handleSubmit as any}
                onPressCancel={() => {
                  navigation.goBack();
                }}
                // loading={loading}
              />
            </View>
            <StorageUsage totalStorageInMB={10000} usedStorageInMB={2000} />
          </View>
        )}
      </Formik>
    </View>
  );
};

const ButtonSafe = ({
  onPress,
  title,
  iconName,
}: {
  onPress: () => void;
  title: string;
  iconName: string;
}) => (
  <Button
    onPress={onPress}
    title={title}
    color="primary"
    containerStyle={{ margin: 5, width: 'auto' }}
    radius="5"
    icon={<MaterialCommunityIcons name={iconName} size={30} style={{}} />}
    iconPosition="left"
    titleStyle={{
      color: 'black',
      fontWeight: 'normal',
    }}
  />
);

export default SafeOption;

import { TextInput, View } from 'react-native';
import { Button, Text, useTheme } from '@rneui/themed';
import * as yup from 'yup';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { PrivateRootStackParams } from '../../navigator/RootNavigator';
import { useEffect, useState } from 'react';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IconButtonsSaveCancel } from '../ui/IconButtons';
import { Formik } from 'formik';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import StorageUsage from '../ui/StorageUsage';
import SwitchUI from '../ui/SwitchUI';
import PickerUI from '../ui/PickerUI';
import useAuthStore from '../../store/useAuthStore';
import { SafeUtil } from '../../utils/SafeUtil';
import SpinnerUI from '../ui/SpinnerUI';
import { getSafeApi } from '../../services/safeApi';
import TextInputSaveUI from '../ui/TextInputSaveUI';
import TextSaveUI from '../ui/TextSaveUI';

const validationSchema = yup.object().shape({});

const SafeOption = () => {
  const {
    params: { safeId },
  } = useRoute<RouteProp<PrivateRootStackParams, 'SafeOption'>>();
  const user = useAuthStore((state) => state.user);
  const [autoSharing, setAutoSharing] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedSafeId, setSelectedSafeId] = useState(safeId);
  const queryClient = useQueryClient();
  const navigation = useNavigation<NavigationProp<PrivateRootStackParams>>();
  const {
    theme: { colors },
  } = useTheme();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['files'],
    queryFn: () => getSafeApi({ safeId }),
  });

  if (isPending) return <SpinnerUI />;

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
            <ErrorMessageUI display={isError} message={error?.message} />
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
                marginBottom: 30,
              }}>
              <ButtonSafe
                onPress={() => {
                  navigation.navigate('AutoSharingSetup', { safeId });
                }}
                title="Auto-sharing setup"
                iconName="share-variant-outline"
              />
            </View>

            <View
              style={{
                marginBottom: 30,
              }}>
              <TextInputSaveUI
                numberOfLines={4}
                onChangeText={setDescription}
                value={description}
                style={{}}
              />
            </View>
            <View style={{ marginBottom: 20 }}>
              <TextSaveUI
                label="Safe name"
                containerStyle={{ width: 350 }}
                onChangeText={() => {}}
                onBlur={() => {}}
                value={'safe name'}
                onPress={() => {}}
              />
              <ButtonSafe onPress={() => {}} title="Delete safe" iconName="delete-outline" />
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
              }}></View>
            <StorageUsage
              totalStorageInMB={user?.storageQuotaInMB || 0}
              usedStorageInBytes={user?.storageUsedInBytes || 0}
            />
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

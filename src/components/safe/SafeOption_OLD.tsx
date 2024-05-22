import { View } from 'react-native';
import { Button, Text, useTheme } from '@rneui/themed';
import * as yup from 'yup';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { PrivateRootStackParams } from '../../navigator/RootNavigator';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Formik } from 'formik';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import StorageUsage from '../ui/StorageUsage';
import SwitchUI from '../ui/SwitchUI';
import PickerUI from '../ui/PickerUI';
import useAuthStore from '../../store/useAuthStore';
import SpinnerUI from '../ui/SpinnerUI';
import { getSafeApi, updateSafeApi } from '../../services/safeApi';
import TextInputSaveUI from '../ui/TextInputSaveUI';
import TextSaveUI from '../ui/TextSaveUI';

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
});

const SafeOption = () => {
  const {
    params: { safeId },
  } = useRoute<RouteProp<PrivateRootStackParams, 'SafeOption'>>();
  const user = useAuthStore((state) => state.user);
  const [autoSharing, setAutoSharing] = useState(false);
  const [selectedSafeId, setSelectedSafeId] = useState(safeId);
  const queryClient = useQueryClient();
  const navigation = useNavigation<NavigationProp<PrivateRootStackParams>>();
  const {
    theme: { colors },
  } = useTheme();
  let fieldToUpdate: 'name' | 'description';

  useEffect(() => {
    console.log('useEffect-------------------------------------', selectedSafeId);
    queryClient.invalidateQueries({ queryKey: ['safeOptions', selectedSafeId] });
  }, [selectedSafeId]);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['safeOptions', selectedSafeId],
    queryFn: () => getSafeApi({ safeId: selectedSafeId }),
  });

  const {
    mutate: mutateUpdate,
    data: dataUpdate,
    isPending: isPendingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
  } = useMutation({
    mutationFn: updateSafeApi,
    onSuccess: (result: TSafe) => {
      // if(fieldToUpdate === 'name') {
      // }
      console.log('invalidateQueries');
      queryClient.invalidateQueries({ queryKey: ['safeOptions', selectedSafeId] });
    },
  });

  if (isPending || isPendingUpdate) return <SpinnerUI />;

  console.log('SAFE selectedSafeId', selectedSafeId);
  console.log('SAFE data', data);

  return (
    <View style={{ backgroundColor: colors.background1 }}>
      <Formik
        validationSchema={validationSchema}
        initialValues={{ name: data?.name, description: data?.description }}
        onSubmit={(values) => {
          mutateUpdate({
            _id: selectedSafeId,
            name: values.name,
            description: values.description,
            fieldToUpdate,
          });
        }}>
        {({ handleChange, handleBlur, submitForm, values, errors, touched }) => (
          <View
            style={{
              alignItems: 'center',
              marginTop: 20,
              marginBottom: 20,
            }}>
            <ErrorMessageUI
              display={isError || isErrorUpdate}
              message={error?.message || errorUpdate?.message}
            />

            <PickerUI
              selectedValue={selectedSafeId}
              onValueChange={(val: string | number) => {
                setSelectedSafeId(val as string);
              }}
              items={user?.safes as any}
              style={{ width: 300 }}
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
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                errorMessage={errors.name && touched.name ? errors.name : undefined}
                onPressSave={() => {
                  fieldToUpdate = 'description';
                  submitForm();
                }}
              />
            </View>
            <View style={{ marginBottom: 20 }}>
              <TextSaveUI
                label="Safe name"
                containerStyle={{ width: 350 }}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                errorMessage={errors.name && touched.name ? errors.name : undefined}
                onPress={() => {
                  fieldToUpdate = 'name';
                  submitForm();
                }}
              />
              <ButtonSafe onPress={() => {}} title="Delete safe" iconName="delete-outline" />
            </View>

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

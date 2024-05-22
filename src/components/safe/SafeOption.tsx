import { View } from 'react-native';
import { Input, Text, useTheme } from '@rneui/themed';
import { RouteProp, useRoute } from '@react-navigation/native';
import { PrivateRootStackParams } from '../../navigator/RootNavigator';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as yup from 'yup';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import PickerUI from '../ui/PickerUI';
import useAuthStore from '../../store/useAuthStore';
import SpinnerUI from '../ui/SpinnerUI';
import { getSafeApi, updateSafeApi } from '../../services/safeApi';
import TextSaveUI from '../ui/TextSaveUI';
import TextInputSaveUI from '../ui/TextInputSaveUI';

const validationName = yup.object().shape({
  name: yup.string().required('Name is required'),
});
const validationDescription = yup.object().shape({
  description: yup.string().max(100, 'Max 100 characters'),
});

const SafeOption = () => {
  const {
    params: { safeId },
  } = useRoute<RouteProp<PrivateRootStackParams, 'SafeOption'>>();
  const user = useAuthStore((state) => state.user);
  const updateSafe = useAuthStore((state) => state.updateSafe);
  const queryClient = useQueryClient();
  const [safeName, setSafeName] = useState('');
  const [safeNameError, setSafeNameError] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [selectedSafeId, setSelectedSafeId] = useState(safeId);
  const {
    theme: { colors },
  } = useTheme();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['safeOptions', selectedSafeId],
    queryFn: () => getSafeApi({ safeId: selectedSafeId }),
  });

  useEffect(() => {
    if (data) {
      console.log('useEffect >>>>>>> ', data);
      setSafeName(data.name || '');
      setDescription(data.description || '');
      setSelectedSafeId(data._id);

      setSafeNameError('');
      setDescriptionError('');
    }
  }, [data]);

  const {
    mutate: mutateUpdate,
    isPending: isPendingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
  } = useMutation({
    mutationFn: updateSafeApi,
    onSuccess: (result: TSafeUpdate) => {
      const json: TSafe = { _id: result._id };
      if (result.fieldToUpdate === 'name') json.name = result.name;
      if (result.fieldToUpdate === 'description') json.description = result.description;
      updateSafe(json);
      queryClient.invalidateQueries({ queryKey: ['safeOptions', selectedSafeId] });
    },
  });

  if (isPending || isPendingUpdate) return <SpinnerUI />;

  console.log('SAFE selectedSafeId', selectedSafeId);
  console.log('SAFE data', data);

  return (
    <View style={{ backgroundColor: colors.background1 }}>
      <View
        style={{
          alignItems: 'center',
          marginTop: 20,
          marginBottom: 20,
        }}>
        <ErrorMessageUI display={isError} message={error?.message} />
        <ErrorMessageUI display={isErrorUpdate} message={errorUpdate?.message} />

        <PickerUI
          selectedValue={selectedSafeId}
          onValueChange={(val: string | number) => {
            setSelectedSafeId(val as string);
          }}
          items={user?.safes as any}
          style={{ width: 300 }}
        />
        <TextSaveUI
          label="Safe name"
          containerStyle={{ width: 350 }}
          onChangeText={setSafeName}
          value={safeName}
          errorMessage={safeNameError}
          onPress={async () => {
            try {
              await validationName.validate({ name: safeName });
              mutateUpdate({
                _id: selectedSafeId,
                name: safeName,
                fieldToUpdate: 'name',
              });
            } catch (err: any) {
              setSafeNameError(err.errors);
            }
          }}
        />
        <TextInputSaveUI
          numberOfLines={4}
          onChangeText={setDescription}
          value={description}
          errorMessage={descriptionError}
          onPressSave={async () => {
            try {
              await validationDescription.validate({ description });
              mutateUpdate({
                _id: selectedSafeId,
                description: description,
                fieldToUpdate: 'description',
              });
            } catch (err: any) {
              setDescriptionError(err.errors);
            }
          }}
        />
        <View
          style={{
            marginBottom: 20,
          }}>
          <Text>NAME: {data?.name}</Text>
        </View>
      </View>
    </View>
  );
};

export default SafeOption;

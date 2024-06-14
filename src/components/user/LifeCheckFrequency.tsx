import { TouchableOpacity, View } from 'react-native';
import { Button, Text, useTheme } from '@rneui/themed';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Formik } from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import useUserStore from '../../store/useUserStore';
import { IconButtonsSaveCancel } from '../ui/IconButtons';
import PickerUI from '../ui/PickerUI';
import { SHARE_COUNT, SHARE_COUNT_TYPE, SHARE_COUNT_NOT_ANSWERED, WEEKDAY } from '../../Const';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserProfileApi } from '../../services/authApi';
import SpinnerUI from '../ui/SpinnerUI';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import { MenuDrawerParams } from '../../navigator/MenuDrawer';

const validationSchema = yup.object().shape({
  shareWeekday: yup.string().required('Please enter valid weekday'),
});

const LifeCheckFrequency = () => {
  const {
    theme: { colors },
  } = useTheme();
  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();
  const { updateUserLifeCheck } = useUserStore();
  const [time, setTime] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['lifeCheckFrequency'],
    queryFn: () => getUserProfile(),
  });

  useEffect(() => {
    console.log('useEffect DATE', data);
    if (data && data.lifeCheck.shareTime) setTime(new Date(data.lifeCheck.shareTime));
  }, [data]);

  const {
    mutate: mutate,
    isPending: isPendingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
  } = useMutation({
    mutationFn: updateUserProfileApi,
    onSuccess: (result: TUserUpdate) => {
      const { shareTime, shareWeekday, shareCount, shareCountType, shareCountNotAnswered } =
        result.lifeCheck;
      updateUserLifeCheck({
        lifeCheck: { shareTime, shareWeekday, shareCount, shareCountType, shareCountNotAnswered },
      });
      queryClient.invalidateQueries({ queryKey: ['lifeCheckFrequency'] });
      navigation.navigate('LifeCheckSetup');
    },
  });

  if (isPending || isPendingUpdate) return <SpinnerUI />;

  return (
    <View style={{ backgroundColor: colors.background1, flex: 1 }}>
      <ErrorMessageUI display={isError} message={error?.message} />
      <ErrorMessageUI display={isErrorUpdate} message={errorUpdate?.message} />
      <TouchableOpacity
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: 5,
          justifyContent: 'center',
          marginVertical: 30,
        }}
        onPress={() => {
          navigation.navigate('LifeCheckHelp');
        }}>
        <Text>Help</Text>
        <MaterialCommunityIcons
          name="comment-question-outline"
          size={30}
          style={{ marginRight: 5 }}
        />
      </TouchableOpacity>
      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={{
          shareTime: data?.lifeCheck.shareTime,
          shareWeekday: data?.lifeCheck.shareWeekday,
          shareCount: data?.lifeCheck.shareCount,
          shareCountType: data?.lifeCheck.shareCountType,
          shareCountNotAnswered: data?.lifeCheck.shareCountNotAnswered,
        }}
        onSubmit={(values) => {
          console.log('onSubmit', values, moment(time).format('hh-mm a'));

          mutate({
            lifeCheck: {
              shareTime: time,
              shareWeekday: values.shareWeekday,
              shareCount: values.shareCount,
              shareCountType: values.shareCountType,
              shareCountNotAnswered: values.shareCountNotAnswered,
            },
            fieldsToUpdate: [
              'lifeCheck.shareTime',
              'lifeCheck.shareWeekday',
              'lifeCheck.shareCount',
              'lifeCheck.shareCountType',
              'lifeCheck.shareCountNotAnswered',
            ],
          });
        }}>
        {({ handleChange, handleSubmit, values }) => (
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: colors.background2,
                width: '100%',
                paddingVertical: 20,
              }}>
              <Text>Send life-checking every</Text>
              <PickerUI
                selectedValue={values.shareWeekday}
                onValueChange={handleChange('shareWeekday')}
                items={WEEKDAY}
              />
              <View style={{ alignItems: 'center', gap: 5, flexDirection: 'row' }}>
                <Text>At: </Text>
                <Button
                  title={moment(time).format('hh-mm a') + ' '}
                  onPress={() => setOpen(true)}
                  icon={
                    <MaterialCommunityIcons name="clock-time-eight-outline" size={30} style={{}} />
                  }
                  iconRight={true}
                />
                <DatePicker
                  modal
                  mode="time"
                  open={open}
                  date={time}
                  onConfirm={(date) => {
                    setOpen(false);
                    setTime(date);
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />
              </View>
            </View>
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                <Text>Share safes</Text>
                <PickerUI
                  selectedValue={values.shareCount?.toString()}
                  onValueChange={handleChange('shareCount')}
                  items={SHARE_COUNT}
                  style={{ width: 120 }}
                />
                <PickerUI
                  selectedValue={values.shareCountType}
                  onValueChange={handleChange('shareCountType')}
                  items={SHARE_COUNT_TYPE}
                  style={{ width: 150 }}
                />
              </View>
              <View style={{ alignItems: 'center' }}>
                <View style={{ alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                  <Text>after</Text>
                  <PickerUI
                    selectedValue={values.shareCountNotAnswered?.toString()}
                    onValueChange={handleChange('shareCountNotAnswered')}
                    items={SHARE_COUNT_NOT_ANSWERED}
                    style={{ width: 120 }}
                  />
                </View>
                <Text style={{ marginBottom: 20 }}>consecutive unanswered life-checks.</Text>
              </View>
            </View>

            <View
              style={{ backgroundColor: colors.background2, width: '100%', paddingVertical: 20 }}>
              <IconButtonsSaveCancel
                onPressSave={handleSubmit}
                onPressCancel={() => {
                  navigation.goBack();
                }}
              />
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default LifeCheckFrequency;

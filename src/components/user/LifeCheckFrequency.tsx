import { TouchableOpacity, View } from 'react-native';
import { Button, Input, Text, useTheme } from '@rneui/themed';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Formik } from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import { PrivateRootStackParams } from '../../navigator/RootNavigator';
import useAuthStore from '../../store/useAuthStore';
import { IconButtonsSaveCancel } from '../ui/IconButtons';
import PickerUI from '../ui/PickerUI';
import {
  SHARE_SAFE_TIME,
  SHARE_SAFE_TIME_TYPE,
  SHARE_SAFE_TIME_UNANSWERED,
  WEEKDAY,
} from '../../Const';
import { useState } from 'react';

const validationSchema = yup.object().shape({});

const LifeCheckFrequency = () => {
  const {
    theme: { colors },
  } = useTheme();
  const navigation = useNavigation<NavigationProp<PrivateRootStackParams>>();
  const { user } = useAuthStore();
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  return (
    <View style={{ backgroundColor: colors.background1, flex: 1 }}>
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
        validationSchema={validationSchema}
        initialValues={{
          weekday: 'mon',
          shareSafesTime: 5,
          shareSafesTimeType: 'days',
          shareSafesTimeUnanswered: 3,
        }}
        onSubmit={(values) => {}}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
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
                selectedValue={values.weekday}
                onValueChange={() => {
                  handleChange('weekday');
                }}
                items={WEEKDAY}
              />
              <View style={{ alignItems: 'center', gap: 5, flexDirection: 'row' }}>
                <Text>At: </Text>
                <Button
                  title={moment(date).format('hh-mm a') + ' '}
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
                  date={date}
                  onConfirm={(date) => {
                    setOpen(false);
                    setDate(date);
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
                  selectedValue={values.weekday}
                  onValueChange={() => {
                    handleChange('shareSafesTime');
                  }}
                  items={SHARE_SAFE_TIME}
                  style={{ width: 120 }}
                />
                <PickerUI
                  selectedValue={values.weekday}
                  onValueChange={() => {
                    handleChange('shareSafesTimeType');
                  }}
                  items={SHARE_SAFE_TIME_TYPE}
                  style={{ width: 150 }}
                />
              </View>
              <View style={{ alignItems: 'center' }}>
                <View style={{ alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                  <Text>after</Text>
                  <PickerUI
                    selectedValue={values.weekday}
                    onValueChange={() => {
                      handleChange('shareSafesTimeUnanswered');
                    }}
                    items={SHARE_SAFE_TIME_UNANSWERED}
                    style={{ width: 120 }}
                  />
                </View>
                <Text style={{ marginBottom: 20 }}>consecutive unanswered life-checks.</Text>
              </View>
            </View>

            <View
              style={{ backgroundColor: colors.background2, width: '100%', paddingVertical: 20 }}>
              <IconButtonsSaveCancel
                onPressSave={() => {}}
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

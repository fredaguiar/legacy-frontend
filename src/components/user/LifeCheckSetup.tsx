import { TouchableOpacity, View } from 'react-native';
import { Button, Text, useTheme } from '@rneui/themed';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { PrivateRootStackParams } from '../../navigator/RootNavigator';
import useAuthStore from '../../store/useAuthStore';
import { IconButtonsSaveCancel } from '../ui/IconButtons';
import LifeCheckUI from '../ui/LifeCheckUI';
import { MapsUtil } from '../../utils/MapsUtil';
import { WEEKDAY } from '../../Const';

const weekdayMap = MapsUtil.getMap(WEEKDAY);

const LifeCheckSetup = () => {
  const {
    theme: { colors },
  } = useTheme();
  const navigation = useNavigation<NavigationProp<PrivateRootStackParams>>();
  const { user } = useAuthStore();

  return (
    <View style={{ backgroundColor: colors.background1, flex: 1 }}>
      <TouchableOpacity
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: 5,
          justifyContent: 'center',
          marginVertical: 20,
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

      <View
        style={{
          backgroundColor: colors.background2,
          alignItems: 'center',
          marginBottom: 20,
          padding: 20,
        }}>
        <LifeCheckUI currentScreen="setup" />
      </View>

      <Button
        onPress={() => {
          navigation.navigate('LifeCheckFrequency');
        }}
        title="Life check frequency"
        color={colors.primary}
        containerStyle={{ margin: 5, width: '80%', marginBottom: 20, alignSelf: 'center' }}
        icon={
          <MaterialCommunityIcons
            name="calendar-multiple-check"
            size={30}
            style={{ marginRight: 5 }}
          />
        }
      />
      {user?.lifeCheck.shareTime && (
        <View style={{ marginBottom: 20, backgroundColor: colors.background2 }}>
          <Text
            style={{
              fontSize: 18,
              alignSelf: 'center',
              padding: 20,
            }}>
            Send Life-check messages every
            <Text style={{ fontWeight: 'bold' }}>
              {' '}
              {weekdayMap.get(user?.lifeCheck.shareWeekday)}
            </Text>
            , at
            <Text style={{ fontWeight: 'bold' }}>
              {' '}
              {moment(user?.lifeCheck.shareTime).format('h-mm a')}
            </Text>
            . Share safe(s)
            <Text style={{ fontWeight: 'bold' }}>
              {user?.lifeCheck.shareCount} {user?.lifeCheck.shareCountType}
            </Text>{' '}
            after{' '}
            <Text style={{ fontWeight: 'bold' }}>{user?.lifeCheck.shareCountNotAnswered}</Text>{' '}
            consecutive unanswered life-check messages
          </Text>
        </View>
      )}
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 18, alignSelf: 'center', fontWeight: 'bold' }}>
          Phone: +{user?.phoneCountry} {user?.phone}
        </Text>
        <Text style={{ fontSize: 16, alignSelf: 'center', fontWeight: 'bold' }}>
          Email: {user?.email}
        </Text>
      </View>
      <Text style={{ fontSize: 18, alignSelf: 'center', marginBottom: 20, marginHorizontal: 20 }}>
        In order to save this info, two codes will be sent to the registered email and phone. Please
        make sure you have access to the email and SMS inboxes to have access and copy the codes.
      </Text>
      <IconButtonsSaveCancel
        onPressSave={() => {}}
        onPressCancel={() => {
          navigation.goBack();
        }}
      />
    </View>
  );
};

export default LifeCheckSetup;

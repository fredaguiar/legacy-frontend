import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { useState } from 'react';
import { Button, useTheme } from '@rneui/themed';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { PrivateRootStackParams } from '../../navigator/RootNavigator';
import { getSafeApi } from '../../services/safeApi';
import SpinnerUI from '../ui/SpinnerUI';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import useAuthStore from '../../store/useAuthStore';
import ContactListUI from './AutoSharingContactList';
import AutoSharingAddContact from './AutoSharingAddContact';
import { SafeUtil } from '../../utils/SafeUtil';

const AutoSharingContactListUpdate = () => {
  const {
    params: { safeId, type },
  } = useRoute<RouteProp<PrivateRootStackParams, 'AutoSharingContactListUpdate'>>();
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useAuthStore();
  const safe = SafeUtil.getSafe(user, safeId);
  const queryClient = useQueryClient();
  const {
    theme: { colors },
  } = useTheme();

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['contactList', safeId],
    queryFn: () => getSafeApi({ safeId }),
  });

  if (isPending) return <SpinnerUI />;

  return (
    <View style={{ backgroundColor: colors.background1 }}>
      <View
        style={{
          alignItems: 'center',
          marginTop: 20,
          marginBottom: 20,
        }}>
        <ErrorMessageUI display={isError} message={error?.message} />

        <ButtonAddContact title="Add email" iconName="email-plus-outline" onPress={toggleModal} />
        <AutoSharingAddContact
          safeId={safeId}
          isVisible={modalVisible}
          onClose={toggleModal}
          type="emails"
          onAddContactSuccess={(result: TSafeUpdate) => {
            // setContacList({ contactList: result.emails, safeId, type:'emails' });
            setModalVisible(false);
            queryClient.invalidateQueries({ queryKey: ['contactList', safeId] });
          }}
        />
        <View style={[{ flexDirection: 'row', marginBottom: 25, marginHorizontal: 5 }]}>
          <ContactListUI type="email" contactList={safe?.emails || []} />
        </View>
      </View>
    </View>
  );
};

const ButtonAddContact = ({
  onPress,
  title,
  iconName,
  style,
  containerStyle,
}: {
  onPress: () => void;
  title: string;
  iconName: string;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}) => (
  <Button
    onPress={onPress}
    title={title}
    color="primary"
    style={style}
    containerStyle={[{ margin: 5, width: 'auto' }, containerStyle]}
    radius="5"
    icon={<MaterialCommunityIcons name={iconName} size={30} style={{ marginRight: 5 }} />}
    iconPosition="left"
    titleStyle={{
      color: 'black',
      fontWeight: 'normal',
    }}
  />
);

export default AutoSharingContactListUpdate;

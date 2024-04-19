import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SearchBar, useTheme } from '@rneui/themed';
import { SORT_SAFE_BY } from '../../Const';
import { SafeUtil } from '../../utils/SafeUtil';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { PrivateRootStackParams } from '../../navigator/RootNavigator';
import PickerUI from '../ui/PickerUI';
import useAuthStore from '../../store/useAuthStore';
import useSafeStore from '../../store/useSafeStore';

const SearchFiles = () => {
  const [search, setSearch] = useState('');
  const [sortSafe, setSortSafe] = useState('');
  const navigation = useNavigation<NavigationProp<PrivateRootStackParams>>();
  const { user } = useAuthStore();
  const { safeId } = useSafeStore();
  const safe = SafeUtil.getSafe(user, safeId);

  const {
    theme: { colors },
  } = useTheme();

  const updateSearch = (search: string) => {
    // setSearch(search);
    // const filtered = data.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    // setFilteredData(filtered);
  };

  return (
    <View style={{ paddingTop: 10, backgroundColor: colors.background1 }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          paddingHorizontal: 5,
          marginVertical: 20,
        }}>
        {safe && (
          <MaterialCommunityIcons
            name="arrow-left-bold"
            size={40}
            style={{}}
            onPress={() => {
              // safeIdVar(null);
            }}
          />
        )}
        <SearchBar
          onChangeText={setSearch}
          value={search}
          placeholder="Search on files"
          containerStyle={{
            width: 350,
            maxHeight: 65,
            backgroundColor: colors.input1,
            borderRadius: 10,
            borderColor: '#cccccc',
            borderWidth: 1,
            borderTopWidth: 0,
            borderBottomWidth: 0,
          }}
          style={{
            backgroundColor: colors.input1,
            fontSize: 22,
            color: 'black',
            textDecorationLine: 'none',
            borderBottomWidth: 0,
          }}
          inputContainerStyle={{ backgroundColor: colors.input1 }}
        />
      </View>
      {!safe && (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 5,
            marginBottom: 10,
          }}>
          <Text style={{ fontSize: 18 }}>My Safes 9 of 10</Text>

          <PickerUI
            selectedValue={sortSafe}
            onValueChange={(val: string | number) => {
              setSortSafe(val as string);
            }}
            items={SORT_SAFE_BY as any}
          />
        </View>
      )}
      {safe && (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            marginBottom: 10,
          }}>
          <MaterialCommunityIcons name="treasure-chest" size={50} style={{ marginRight: 5 }} />
          <Text style={{ marginRight: 20, fontSize: 20 }}>{safe.name}</Text>
          <View style={{}}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AutoSharingSetup', { safeId: safe._id });
              }}
              style={{}}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.primary,
                  padding: 5,
                  borderRadius: 10,
                }}>
                <MaterialCommunityIcons name="arrow-left-bold-circle" size={40} />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Set auto-share</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default SearchFiles;

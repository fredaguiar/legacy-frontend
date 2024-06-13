import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SearchBar, useTheme } from '@rneui/themed';
import { SORT_SAFE_BY } from '../../Const';
import { SafeUtil } from '../../utils/SafeUtil';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MenuDrawerParams } from '../../navigator/MenuDrawer';
import PickerUI from '../ui/PickerUI';
import useUserStore from '../../store/useUserStore';
import useSafeStore from '../../store/useSafeStore';

const SearchFiles = () => {
  const [search, setSearch] = useState('');
  const [sortSafe, setSortSafe] = useState('');
  const navigation = useNavigation<NavigationProp<MenuDrawerParams>>();
  const user = useUserStore((state) => state.user);
  const safeId = useSafeStore((state) => state.safeId);
  const setSafeId = useSafeStore((state) => state.setSafeId);
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
          marginTop: 10,
        }}>
        {safe && (
          <MaterialCommunityIcons
            name="arrow-left-bold"
            size={40}
            style={{}}
            onPress={() => {
              setSafeId(undefined);
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
            justifyContent: 'space-around',
          }}>
          <Text style={{ fontSize: 18 }}>My Safes ({user?.safes.length})</Text>
          <PickerUI
            selectedValue={sortSafe}
            onValueChange={(val) => {
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
            marginVertical: 20,
            justifyContent: 'space-around',
            width: '100%',
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <MaterialCommunityIcons name="treasure-chest" size={50} style={{ marginRight: 2 }} />
            <Text numberOfLines={2} style={{ width: 160, fontSize: 20 }}>
              {safe.name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AutoSharing', { safeId: safe._id || '' });
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
              <MaterialCommunityIcons name="share-variant-outline" size={30} />
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Auto-share</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default SearchFiles;

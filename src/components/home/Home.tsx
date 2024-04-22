import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Divider, useTheme } from '@rneui/themed';
import SafeList from '../safe/SafeList';
import Bottom from '../bottom/Bottom';
import LifeCheck from '../top/LifeCheck';
import SearchFiles from '../top/SearchFiles';
import { SafeUtil } from '../../utils/SafeUtil';
import ItemList from '../safe/ItemList';
import useAuthStore from '../../store/useAuthStore';
import useSafeStore from '../../store/useSafeStore';

const Home = () => {
  const {
    theme: { colors },
  } = useTheme();
  const { user } = useAuthStore();
  const { safeId } = useSafeStore();
  const safe = SafeUtil.getSafe(user, safeId);

  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <LifeCheck />
        <SearchFiles />
      </View>
      <Divider style={{ borderWidth: 1, borderColor: colors.divider2 }} />
      <View style={[styles.containerScrollView, { backgroundColor: colors.background }]}>
        {!safe ? <SafeList /> : <ItemList />}
      </View>
      <Bottom />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerHeader: {
    height: 'auto',
  },
  containerScrollView: {
    flex: 1,
  },
});

export default Home;

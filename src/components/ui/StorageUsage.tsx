import { LinearProgress } from '@rneui/themed';
import { View, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const formatSize = (sizeInMB: number): string => {
  if (sizeInMB < 1024) {
    return `${sizeInMB.toFixed(2)} Mb`; // Display as MB if less than 1024MB
  }
  const sizeInGB = sizeInMB / 1024;
  return `${sizeInGB.toFixed(2)} Gb`; // Convert to GB if 1024MB or more
};

const StorageUsage = ({
  usedStorageInMB,
  totalStorageInMB,
}: {
  usedStorageInMB: number;
  totalStorageInMB: number;
}) => {
  const almostFull = usedStorageInMB / totalStorageInMB > 0.9;
  return (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="cloud" size={50} style={{ marginRight: 5 }} />
          <Text
            style={{
              fontSize: 20,
              marginRight: 10,
            }}>
            Storage
          </Text>
        </View>
        {almostFull && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={30}
              style={{ marginRight: 5 }}
              color="red"
            />
            <Text
              style={{
                fontSize: 20,
                color: 'red',
                fontWeight: 'bold',
                marginRight: 10,
              }}>
              Almost full
            </Text>
          </View>
        )}
      </View>

      <LinearProgress
        value={usedStorageInMB / totalStorageInMB}
        variant="determinate"
        color={almostFull ? 'red' : '#555555'}
        trackColor="white"
        style={{ width: 350, height: 20, borderRadius: 5 }}
      />
      <Text style={{ fontSize: 20 }}>
        {`${formatSize(usedStorageInMB)}  of  ${formatSize(totalStorageInMB)}  used`}
      </Text>
    </View>
  );
};

export default StorageUsage;

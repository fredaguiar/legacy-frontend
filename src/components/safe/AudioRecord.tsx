import { useEffect, useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { AVPlaybackStatus, Audio } from 'expo-av';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RouteProp, useRoute } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import { Slider, Text, useTheme } from '@rneui/themed';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import { PrivateRootStackParams } from '../../navigator/RootNavigator';

const AudioRecord = () => {
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [sound, setSound] = useState<Audio.Sound>();
  const [error, setError] = useState<string>();
  const [recording, setRecording] = useState<Audio.Recording>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const {
    params: { fileId, mode },
  } = useRoute<RouteProp<PrivateRootStackParams, 'AudioRecord'>>();
  const {
    theme: { colors },
  } = useTheme();

  useEffect(() => {
    return () => {
      if (sound) {
        console.log('Unloading Sound');
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const checkPermission = async () => {
    if (permissionResponse?.status === 'granted') {
      return true;
    }
    const requestResponse = await requestPermission();
    return requestResponse;
  };

  async function playSound() {
    try {
      if (!checkPermission()) {
        setError('Not allowed');
        return;
      }

      const localFilePath = `${RNFS.DocumentDirectoryPath}/song.mp3`;
      console.log('localFilePath', localFilePath);

      // const localFilePath =
      //   'file:///data/user/0/com.fredaguiar.legacyfrontend/cache/Audio/recording-d17c95ea-91fb-437f-914b-5a380002359c.m4a';

      const exists = await RNFS.exists(localFilePath);
      console.log('EXISTS?', exists);

      const { sound: newSound } = await Audio.Sound.createAsync({ uri: localFilePath });

      setSound(newSound);
      setIsPlaying(true);

      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
      }
      newSound.setOnPlaybackStatusUpdate(updateStatus);

      console.log('Playing Sound');
      await newSound.playAsync();
    } catch (err: any) {
      console.log(`Play sound error${err?.message}`);
      setError('Play sound error');
    }
  }

  const updateStatus = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      if (status.didJustFinish && !status.isLooping) {
        setIsPlaying(false);
        setPosition(0); // Reset the position
      }
    }
  };

  const startRecording = async () => {
    try {
      if (!checkPermission()) {
        setError('Not allowed');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    setRecording(undefined);
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
  };

  const handleSliderChange = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
      setPosition(value);
    }
  };

  const handlePlay = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        const status = await sound.getStatusAsync();
        if (
          status.isLoaded &&
          status.durationMillis &&
          status.positionMillis === status.durationMillis
        ) {
          // If playback has reached the end, reset the position to start
          await sound.setPositionAsync(0);
        }
        await sound.playAsync();
        setIsPlaying(true);
        console.log('playAsync');
      }
    } else if (!sound && !isPlaying) {
      playSound();
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.background1,
        padding: 10,
      }}>
      <ErrorMessageUI display={error} message={error} />
      <Text>{`${Math.round(position / 1000)}s / ${Math.round(duration / 1000)}s`}</Text>

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-around',
          backgroundColor: colors.background2,
          borderColor: colors.black,
          borderWidth: 1,
        }}>
        <Slider
          style={{ width: 300, height: 50, backgroundColor: colors.background2 }}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onValueChange={handleSliderChange}
          onSlidingComplete={handleSliderChange}
          minimumTrackTintColor={'black'}
          maximumTrackTintColor={colors.divider1}
          thumbTintColor={'black'}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: colors.background2,
          }}>
          {mode === 'audio' ? (
            <MaterialCommunityIcons
              name={isPlaying ? 'pause' : 'play'}
              size={50}
              onPress={handlePlay}
            />
          ) : (
            <MaterialCommunityIcons
              name={recording ? 'stop' : 'record-rec'}
              size={50}
              onPress={recording ? stopRecording : startRecording}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default AudioRecord;

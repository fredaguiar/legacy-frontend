import { useEffect, useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { AVPlaybackStatus, Audio } from 'expo-av';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFS from 'react-native-fs';
import { Slider, Text } from '@rneui/themed';
import ErrorMessageUI from '../ui/ErrorMessageUI';

function AudioRecord() {
  const [sound, setSound] = useState<Audio.Sound>();
  const [error, setError] = useState<string>();
  const [recording, setRecording] = useState<Audio.Recording>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    return () => {
      if (sound) {
        console.log('Unloading Sound');
        sound.unloadAsync();
      }
    };
  }, [sound]);

  async function playSound() {
    try {
      // const localFilePath = `file://${RNFS.DownloadDirectoryPath}/song.mp3`;

      const localFilePath =
        'file:///data/user/0/com.fredaguiar.legacyfrontend/cache/Audio/recording-d17c95ea-91fb-437f-914b-5a380002359c.m4a';

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

  async function startRecording() {
    try {
      if (permissionResponse?.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
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
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
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
        await sound.playAsync();
        setIsPlaying(true);
      }
    } else if (!sound && !isPlaying) {
      playSound();
    }
  };

  return (
    <View style={styles.container}>
      <ErrorMessageUI display={error} message={error} />
      <Text>{`${Math.round(position / 1000)}s / ${Math.round(duration / 1000)}s`}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
        <MaterialCommunityIcons
          name={isPlaying ? 'pause' : 'play'}
          size={50}
          onPress={handlePlay}
        />
        <MaterialCommunityIcons
          name={recording ? 'stop' : 'record-rec'}
          size={50}
          onPress={recording ? stopRecording : startRecording}
        />
      </View>

      <Slider
        style={{ width: 300, height: 40 }}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onValueChange={handleSliderChange}
        minimumTrackTintColor="#1fb28a"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#1a9274"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
});

export default AudioRecord;

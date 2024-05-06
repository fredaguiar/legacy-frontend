import { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useMicrophonePermission,
} from 'react-native-vision-camera';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import { Text } from '@rneui/themed';

const CameraScreen = ({}: {}) => {
  const [error, setError] = useState<string | undefined>();
  const [permission, setPermission] = useState(false);
  const { hasPermission, requestPermission } = useCameraPermission();
  const { hasPermission: hasMicPermission, requestPermission: requestMicPermission } =
    useMicrophonePermission();
  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    const init = async () => {
      if (hasPermission && hasMicPermission) {
        setPermission(true);
        return;
      } else {
        const granted = await requestPermission();
        const grantedMic = await requestMicPermission();
        setPermission(granted && grantedMic);
      }
    };
    init();
  }, []);

  if (!device) {
    return <CameraError error={'Camera device error'} />;
  }

  if (!permission) {
    return <CameraError error={error} />;
  }

  const takePhoto = () => {
    console.log('takePhoto takePhoto takePhototakePhoto takePhoto');
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        ref={cameraRef}
        photo={true}
        video={true}
        audio={true}
        orientation="portrait"
        resizeMode="cover"
      />
      <TouchableOpacity
        style={{
          width: 130,
          backgroundColor: '#4CAF50',
          padding: 10,
          alignItems: 'center',
          margin: 20,
        }}
        onPress={takePhoto}>
        <Text>Take Photo</Text>
      </TouchableOpacity>
    </View>
  );
};

const CameraError = ({ error }: { error: string | undefined }) => {
  return (
    <View
      style={{
        alignItems: 'center',
        marginBottom: 20,
      }}>
      <ErrorMessageUI display={error} message={error} />
    </View>
  );
};

export default CameraScreen;

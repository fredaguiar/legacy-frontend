import { useState } from 'react';
import moment from 'moment';
import { CameraOptions, MediaType, launchCamera } from 'react-native-image-picker';
import { useMutation } from '@tanstack/react-query';
import { uploadFilesApi } from '../services/uploadFilesApi';
import useSafeStore from '../store/useSafeStore';
import { FileTypeUtil } from '../utils/FileTypeUtil';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';

const useCamera = () => {
  const [error, setError] = useState<string | undefined>();
  const [cameraData, setCameraData] = useState<TUploadFilesResult>();
  const { safeId } = useSafeStore();

  const { mutate, isPending } = useMutation({
    mutationFn: uploadFilesApi,
    onSuccess: (result: TUploadFilesResult) => {
      console.log('useCamera uploadFilesApi COMPLETE:', result);
      setError(undefined);
      setCameraData(result);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const launchCameraDevice = async (mediaType: MediaType) => {
    try {
      const hasPermission = requestPermission();
      if (!hasPermission) {
        console.error('Camera permission has been denied');
        setError('Camera permission has been denied');
        return;
      }

      let media = undefined;

      if (mediaType === 'photo') {
        const options: CameraOptions = {
          saveToPhotos: true,
          mediaType: 'photo',
          includeBase64: false,
        };
        media = await launchCamera(options);
      }

      if (mediaType === 'video') {
        const options: CameraOptions = {
          mediaType: 'video',
          cameraType: 'back',
        };
        media = await launchCamera(options);
      }

      if (!media) {
        console.error('No camera type has been defined');
        setError('No camera type has been defined');
        return;
      }

      console.log('CAMERA MEDIA RESULT', media);

      if (media.errorMessage) {
        console.error('CAMERA ERROR MESSAGE', media.errorMessage);
        setError(media.errorMessage);
        return;
      }
      if (!media || !media.assets || media.didCancel) {
        setError('Camera canceled');
        return;
      }
      const asset = media.assets[0];

      const split = asset.fileName?.split('.') || [];
      const now = moment().format('MMMM-DD-YYYY-h:mm:ssa');
      const name = `${FileTypeUtil.getFileType(asset.type)}-${now}.${split[split.length - 1]}`;

      mutate({
        name,
        type: asset.type || '',
        uri: asset.uri || '',
        safeId: safeId as string,
      });

      setError(undefined);
    } catch (err: any) {
      console.error('CAMERA ERROR', err);
      setError(err.message);
    }
  };

  return { launchCameraDevice, cameraData, isPendingCamera: isPending, errorCamera: error };
};

const requestPermission = async () => {
  try {
    const cameraCheck = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
    const audioCheck = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    // const writeExternalCheck = await PermissionsAndroid.check(
    //   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    // );

    if (cameraCheck && audioCheck) {
      return true;
    }

    const granted = await PermissionsAndroid.requestMultiple([
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO',
    ]);

    console.log('PermissionsAndroid.RESULTS:', granted);
    if (
      granted['android.permission.CAMERA'] === 'granted' &&
      granted['android.permission.RECORD_AUDIO'] === 'granted'
    ) {
      return true;
    }
    console.log('NO PERMISSION SET');
  } catch (err) {
    console.error('PERMISSION ERROR', err);
  }
  return false;
};

export default useCamera;

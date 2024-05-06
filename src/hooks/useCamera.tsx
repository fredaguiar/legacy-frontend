import { useState } from 'react';
import moment from 'moment';
import { CameraOptions, launchCamera } from 'react-native-image-picker';
import { useMutation } from '@tanstack/react-query';
import { uploadFilesApi } from '../services/uploadFilesApi';
import useSafeStore from '../store/useSafeStore';
import { FileTypeUtil } from '../utils/FileTypeUtil';

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

  const launchCameraDevice = async () => {
    try {
      const options: CameraOptions = {
        saveToPhotos: true,
        mediaType: 'photo',
        includeBase64: false,
      };

      const media = await launchCamera(options);
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

export default useCamera;

import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { useMutation } from '@tanstack/react-query';
import { uploadFilesApi } from '../services/uploadFilesApi';
import useSafeStore from '../store/useSafeStore';

const useUploadFiles = () => {
  const [error, setError] = useState<string | undefined>();
  const [data, setData] = useState<TUploadFilesResult>();
  const { safeId } = useSafeStore();

  const { mutate, isPending } = useMutation({
    mutationFn: uploadFilesApi,
    onSuccess: (result: TUploadFilesResult) => {
      console.log('uploadFileMutation COMPLETE:', result);
      setError(undefined);
      setData(result);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const uploadFiles = async () => {
    try {
      const document = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true, // ???? Ensures a local URI is provided for upload
      });
      if (!document || document.canceled) {
        setError('Import canceled');
        return;
      }

      const asset = document.assets[0];
      mutate({
        name: asset.name,
        type: asset.mimeType || '',
        uri: asset.uri,
        safeId: safeId as string,
      });
      setError(undefined);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { uploadFiles, data, isPending, error };
};

export default useUploadFiles;

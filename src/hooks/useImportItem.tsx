import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { useMutation } from '@tanstack/react-query';
import { TUploadFiles, TUploadFilesResult } from '../typing';
import { uploadFilesApi } from '../services/safeApi';

const useImportItem = () => {
  const [error, setError] = useState<string | undefined>();
  const [data, setData] = useState<TUploadFilesResult>();

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

  const importItem = async () => {
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
      mutate({ name: asset.name, type: asset.mimeType || '', uri: asset.uri });
      setError(undefined);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { importItem, data, isPending, error };
};

export default useImportItem;

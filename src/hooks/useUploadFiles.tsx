import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import RNFS from 'react-native-fs';
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
    } catch (err: any) {
      setError(err.message);
    }
  };

  const uploadTextEditorFiles = async ({ text, title }: TText) => {
    try {
      const localFilePath = `${RNFS.DocumentDirectoryPath}/${title}`;
      console.log('localFilePath', localFilePath);
      await RNFS.writeFile(localFilePath, text, 'utf8');

      mutate({
        name: title,
        safeId: safeId as string,
        type: 'text/html',
        uri: `file://${localFilePath}`,
      });
    } catch (err: any) {
      console.log('uploadTextEditorFiles localFilePath ERR', err.message);
      setError(err.message);
    }
  };

  return { uploadFiles, uploadTextEditorFiles, data, isPending, error };
};

export default useUploadFiles;

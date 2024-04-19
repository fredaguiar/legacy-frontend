import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';

// const GQL_ADD_ITEM = gql`
//   mutation AddItem($itemInput: ItemInput!) {
//     addItem(ItemInput: $itemInput) {
//       name
//       type
//       _id
//     }
//   }
// `;

// const GQL_UPLOAD_FILE = gql`
//   mutation UploadDocuments($docs: [DocumentUploadInput!]!) {
//     uploadDocuments(docs: $docs) {
//       success
//       message
//     }
//   }
// `;

type TUploadResult = {
  url: string;
  filename: string;
};

const useImportItem = () => {
  const [errorItem, setErrorItem] = useState<string | undefined>();
  const [data, setData] = useState<TUploadResult>();
  // const currUser = useReactiveVar(userProfileVar);
  // const safeId = useReactiveVar(safeIdVar);

  // const [uploadFileMutation, { loading: loadingItem }] = useMutation(GQL_UPLOAD_FILE, {
  //   onCompleted: (data: { uploadDocuments: TITem }) => {
  //     console.log('uploadFileMutation COMPLETE:', data.uploadDocuments);

  //     // const updatedSafes = currUser.safes.map((safe: TSafe) => {
  //     //   if (safe._id === safeId) {
  //     //     return { ...safe, items: [...safe.items, ...[data.addItem]] };
  //     //   }
  //     //   return safe;
  //     // });
  //     // userProfileVar({ ...currUser, safes: updatedSafes });
  //     // setData(data.addItem);
  //   },
  //   onError(error) {
  //     setErrorItem(error.message);
  //   },
  // });

  const importItem = async () => {
    try {
      const document = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true, // ???? Ensures a local URI is provided for upload
      });
      if (!document || document.canceled) {
        setErrorItem('Import canceled');
        return;
      }

      const asset = document.assets[0];
      const file = {
        uri: asset.uri,
        type: asset.mimeType,
        name: asset.name,
      };

      console.log('UPLOAD FILE', file);

      // uploadFileMutation({ variables: { docs: [{ docType: asset.mimeType, file: asset.file }] } });
      setErrorItem(undefined);
    } catch (err: any) {
      setErrorItem(err.message);
    }
  };

  const loadingItem = null;
  const error = null;
  return { importItem, data, loadingItem, errorItem };
};

export default useImportItem;

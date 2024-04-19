import { useNavigation } from '@react-navigation/native';

const useCreateNewSafe = () => {
  const navigation = useNavigation();
  // const [createSafeMutation, { loading, error }] = useMutation(GQL_CREATE_SAFE, {
  //   onCompleted: (data: { createSafe: TSafe }) => {
  //     console.log('createSafeMutation COMPLETE:', data.createSafe);
  //     const currUser = userProfileVar() as TUser;
  //     userProfileVar({ ...currUser, safes: [...currUser.safes, ...[data.createSafe]] });
  //     safeIdVar(data.createSafe._id);
  //     navigation.goBack();
  //   },
  // });

  const createNewSafe = (name: string) => {
    // createSafeMutation({ variables: { safeInput: { name } } });
  };

  const loading = null;
  const error = null;
  return { createNewSafe, loading, error };
};

export default useCreateNewSafe;

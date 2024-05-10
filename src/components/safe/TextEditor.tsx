import { Input, useTheme } from '@rneui/themed';
import { Formik } from 'formik';
import * as yup from 'yup';
import RNFS from 'react-native-fs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { useMutation } from '@tanstack/react-query';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import { saveTextTitleApi } from '../../services/safeApi';
import { IconButtonsSaveCancel, SmallButtonSaveCancel } from '../ui/IconButtons';
import useUploadFiles from '../../hooks/useUploadFiles';
import { PrivateRootStackParams } from '../../navigator/RootNavigator';
import useSafeStore from '../../store/useSafeStore';

const validationSchema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .matches(
      /^[a-zA-Z0-9 ._-]+$/,
      'Invalid title. Use only letters, numbers, periods(.), underscores(_), and hyphens(-)',
    )
    .required('Title is Required'),
});

const TextEditor = () => {
  const richText = React.useRef(null);
  const [editTitle, setEditTitle] = useState(false);
  const navigation = useNavigation<NavigationProp<PrivateRootStackParams>>();
  const { uploadTextEditorFiles, data, isPending, error } = useUploadFiles();
  const { safeId } = useSafeStore();
  const {
    theme: { colors },
  } = useTheme();
  const {
    params: { fileId, title, localFilePath },
  } = useRoute<RouteProp<PrivateRootStackParams, 'TextEditor'>>();

  useEffect(() => {
    if (data) {
      navigation.navigate('Home');
      return;
    }
    const init = async () => {
      if (localFilePath) {
        const content = await RNFS.readFile(localFilePath, 'utf8');
        console.log(content);
      }
    };
    init();
  }, [data]);

  const {
    mutate: mutateTitle,
    isPending: isPendingTitle,
    isError: isErrorTitle,
    error: errorTitle,
  } = useMutation({
    mutationFn: saveTextTitleApi,
    onSuccess: (result: boolean) => {
      setEditTitle(false);
    },
  });

  const currentTitle = title || `doc - ${moment().format('MMMM DD YYYY h-mma')}`;
  let saveTitleOnly = false;

  return (
    <SafeAreaView>
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <Formik
            validationSchema={validationSchema}
            initialValues={{ title: currentTitle, text: 'Enter text here' }}
            onSubmit={(values) => {
              if (saveTitleOnly && fileId) {
                mutateTitle({ title: values.title, safeId: safeId as string, fileId });
              } else if (!saveTitleOnly) {
                uploadTextEditorFiles({ title: values.title, text: values.text, fileId });
              }
            }}>
            {({ handleChange, handleBlur, values, errors, touched, submitForm }) => (
              <View>
                <View style={{ paddingVertical: 20, backgroundColor: colors.background2 }}>
                  <IconButtonsSaveCancel
                    onPressSave={() => {
                      saveTitleOnly = false;
                      submitForm();
                    }}
                    onPressCancel={() => {
                      navigation.goBack();
                    }}
                    containerStyle={{ backgroundColor: colors.background2 }}
                    loading={isPending || isPendingTitle}
                  />
                </View>
                <View
                  style={{
                    display: 'flex',
                    marginVertical: 30,
                  }}>
                  <Input
                    label="Title"
                    onChangeText={handleChange('title')}
                    disabled={!editTitle}
                    onBlur={handleBlur('title')}
                    containerStyle={{}}
                    selectTextOnFocus={true}
                    value={values.title}
                    errorMessage={errors.title && touched.title ? errors.title : undefined}
                    rightIcon={
                      editTitle ? (
                        <TouchableOpacity
                          onPress={() => {
                            saveTitleOnly = true;
                            setEditTitle(false);
                          }}>
                          <MaterialCommunityIcons name={'checkbox-outline'} size={30} />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            setEditTitle(true);
                          }}>
                          <MaterialCommunityIcons name={'lead-pencil'} size={30} />
                        </TouchableOpacity>
                      )
                    }
                  />
                  <ErrorMessageUI display={isErrorTitle} message={errorTitle?.message} />
                </View>
                <ErrorMessageUI display={error} message={error} />

                <RichToolbar
                  editor={richText}
                  onPressAddImage={() => {}}
                  actions={[
                    actions.setBold,
                    actions.setItalic,
                    actions.setUnderline,
                    actions.insertBulletsList,
                    actions.insertOrderedList,
                    // actions.insertImage,
                    actions.checkboxList,
                    actions.undo,
                    actions.redo,
                    // actions.insertLink,
                  ]}
                />
                <View style={{ height: 300 }}>
                  <RichEditor
                    ref={richText}
                    initialHeight={300}
                    containerStyle={{
                      backgroundColor: 'black',
                      borderColor: 'black',
                      borderWidth: 1,
                      marginHorizontal: 10,
                    }}
                    style={{ flex: 1 }}
                    onChange={handleChange('text')}
                  />
                </View>
              </View>
            )}
          </Formik>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TextEditor;

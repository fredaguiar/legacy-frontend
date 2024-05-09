import { Button, Divider, Input, useTheme } from '@rneui/themed';
import { Formik } from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import React, { MutableRefObject, useEffect, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Text,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { useMutation } from '@tanstack/react-query';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import { saveTextTitleApi } from '../../services/textApi';
import { IconButtonsSaveCancel, SmallButtonSaveCancel } from '../ui/IconButtons';
import useUploadFiles from '../../hooks/useUploadFiles';
import useSafeStore from '../../store/useSafeStore';
import { PrivateRootStackParams } from '../../navigator/RootNavigator';

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
  const {
    theme: { colors },
  } = useTheme();

  useEffect(() => {
    if (data) {
      navigation.navigate('Home');
    }
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

  const defaultTitle = `doc - ${moment().format('MMMM DD YYYY h-mma')}`;
  let saveTitleOnly = false;

  return (
    <SafeAreaView>
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <Formik
            validationSchema={validationSchema}
            initialValues={{ title: defaultTitle, text: 'Enter text here' }}
            onSubmit={(values) => {
              if (saveTitleOnly) {
                mutateTitle(values.title);
                return;
              }
              uploadTextEditorFiles({ title: values.title, text: values.text });
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
                <TouchableOpacity
                  onPress={() => {
                    setEditTitle(true);
                  }}
                  style={{}}>
                  <View
                    style={{
                      display: 'flex',
                      marginVertical: 30,
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                    }}>
                    <Input
                      label="Title"
                      onChangeText={handleChange('title')}
                      disabled={!editTitle}
                      onBlur={handleBlur('title')}
                      containerStyle={{
                        width: '80%',
                        height: 95,
                      }}
                      selectTextOnFocus={true}
                      value={values.title}
                      errorMessage={errors.title && touched.title ? errors.title : undefined}
                      rightIcon={
                        !editTitle && <MaterialCommunityIcons name={'lead-pencil'} size={30} />
                      }
                    />
                    <ErrorMessageUI display={isErrorTitle} message={errorTitle?.message} />
                    {editTitle && (
                      <SmallButtonSaveCancel
                        onPressSave={() => {
                          saveTitleOnly = true;
                          submitForm();
                        }}
                        onPressCancel={() => {
                          setEditTitle(false);
                        }}
                        style={{
                          fontSize: 20,
                          borderColor: 'black',
                          borderWidth: 1,
                          borderRadius: 5,
                          width: 100,
                          textAlign: 'center',
                          backgroundColor: colors.secondary,
                        }}
                        loading={isPending || isPendingTitle}
                      />
                    )}
                  </View>
                </TouchableOpacity>
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
                <View style={{ height: 400 }}>
                  <RichEditor
                    ref={richText}
                    initialHeight={400}
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

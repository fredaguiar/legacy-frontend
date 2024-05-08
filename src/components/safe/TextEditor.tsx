import { Button, Divider, Input, useTheme } from '@rneui/themed';
import { Formik } from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import React, { MutableRefObject, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import ErrorMessageUI from '../ui/ErrorMessageUI';
import { saveFileApi } from '../../services/saveFileApi';
import { IconButtonsSaveCancel, SmallButton, SmallButtonSaveCancel } from '../ui/IconButtons';
import { theme } from '../../styles/theme';

const validationSchema = yup.object().shape({
  title: yup.string().required('Title is Required'),
});

const TextEditor = () => {
  const richText = React.useRef(null);
  const [article, setArticle] = useState('');
  const [editTitle, setEditTitle] = useState(false);
  const navigation = useNavigation();
  const {
    theme: { colors },
  } = useTheme();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: saveFileApi,
    onSuccess: (data: TSafe) => {
      navigation.goBack();
    },
  });

  return (
    <SafeAreaView>
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <Formik
            validationSchema={validationSchema}
            initialValues={{ title: `doc-${moment().format('MMMM-DD-YYYY-h:mma')}` }}
            onSubmit={(values) => {}}>
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View>
                <View style={{ paddingVertical: 20, backgroundColor: colors.background2 }}>
                  <IconButtonsSaveCancel
                    onPressSave={handleSubmit as any}
                    onPressCancel={() => {
                      navigation.goBack();
                    }}
                    containerStyle={{ backgroundColor: colors.background2 }}
                    loading={isPending}
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
                        height: 85,
                      }}
                      selectTextOnFocus={true}
                      value={values.title}
                      errorMessage={errors.title && touched.title ? errors.title : undefined}
                      rightIcon={
                        !editTitle && <MaterialCommunityIcons name={'lead-pencil'} size={30} />
                      }
                    />
                    {editTitle && (
                      <SmallButtonSaveCancel
                        onPressSave={handleSubmit as any}
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
                        loading={isPending}
                      />
                    )}
                  </View>
                </TouchableOpacity>
                <ErrorMessageUI display={isError} message={error?.message} />

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
                <View style={{}}>
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
                    onChange={(text) => setArticle(text)}
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

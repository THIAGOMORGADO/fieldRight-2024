import React, { useCallback, useMemo, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '../../../components/TextInput';
import { Button } from '../../../components/Button';
import { Title } from '../../../components/Title';
import { Container, Form } from './styles';
import { api } from '../../../config/api';
import { useAuth } from '../../../hooks/auth';

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();

  const { values, handleChange, submitForm, errors, isValid } = useFormik({
    initialValues: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      perfil: 'comprador',
    },
    validationSchema: Yup.object({
      perfil: Yup.string(),
      email: Yup.string().email('E-mail inválido'),
    }),
    onSubmit: async values => {
      const { perfil, ...fields }: any = values;

      const apiValues = Object.keys(fields).reduce((obj: any, key: any) => {
        if (key === 'email') {
          if (user.email !== values.email) obj[key] = fields[key];
        } else if (fields[key]) {
          obj[key] = fields[key];
        }
        return obj;
      }, {});

      try {
        const response = await api.put('api/user/v1/update', { ...apiValues, id: user.id });
        const newUser = user;

        updateUser({ ...newUser, ...apiValues });

        Alert.alert('Feito!', 'Dados alterados com sucesso');
      } catch (e: any) {
      
        const errors = e.response.data.hasOwnProperty('errors') ? e.response.data.errors : e.response.data.message;
        const message = typeof errors === 'string' ? errors : errors.join('. ');
        Alert.alert('Algo deu errado', message);
      }
    },
  });

  const handleSubmit = useCallback(() => {
    if (!isValid) {
      Alert.alert('Oops!', 'Verifique os seus dados e tente novamente');
    } else {
      submitForm();
    }
  }, []);

  return (
    <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <Container>
              <Title fontSize="20px">Meu perfil</Title>
              <Form>
                <TextInput
                  label="Primeiro Nome"
                  errors={errors}
                  name="firstName"
                  handleChange={handleChange}
                  values={values}
                  theme="flat"
                />
                <TextInput
                  label="Sobrenome"
                  errors={errors}
                  name="lastName"
                  handleChange={handleChange}
                  values={values}
                  theme="flat"
                />
                <TextInput
                  label="E-mail"
                  errors={errors}
                  name="email"
                  handleChange={handleChange}
                  values={values}
                  theme="flat"
                  keyboardType="email-address"
                />
                <Button onPress={handleSubmit}>Salvar</Button>
              </Form>
            </Container>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

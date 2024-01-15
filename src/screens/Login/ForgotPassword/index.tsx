import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';

import { Title } from '../../../components/Title';
import { TextInput } from '../../../components/TextInput';
import { Button } from '../../../components/Button';
import { api } from '../../../config/api';

import { Container, Description, Form, FieldWrapper, BtnWrapper } from './styles';
import { AuthTabScreenProps } from '../../../types/navigation';
import { errorHandler } from '../../../utils/errorInstance';

export const ForgotPassword: React.FC = () => {
	const navigation = useNavigation<AuthTabScreenProps>();

	const { values, handleChange, submitForm, errors, isValid } = useFormik({
		initialValues: {
			email: '',
		},
		validationSchema: Yup.object({
			email: Yup.string().email('Invalid email address').required('Required'),
		}),
		onSubmit: async submittedValues => {
			// console.log(submittedValues)
			// navigation.navigate('IntroBuyer')
			try {
				await api.post(`/api/user/v1/forgetPassword?email=${submittedValues.email}`);

				Alert.alert(
					'Feito.',
					'Enviamos um novo código de acesso no seu e-mail. Verifique também sua caixa de SPAM.',
					[
						{
							text: 'Ir para login',
							onPress: () => navigation.navigate('SignIn'),
						},
					],
					{ cancelable: false },
				);
			} catch (e) {
				errorHandler(e, 'forgetPassword', message => Alert.alert('Algo deu errado', message as string));
			}
		},
	});

	const handleSubmit = useCallback(() => {
		if (!isValid) {
			Alert.alert('Oops!', 'Verifique os seus dados e tente novamente');
		} else {
			submitForm();
		}
	}, [isValid, submitForm]);

	return (
		<Container>
			<Form>
				<Title fontSize="20px">Redefinição de Senha</Title>
				<Description>Digite o seu e-mail para receber uma nova senha</Description>
				<FieldWrapper>
					<TextInput
						label="E-mail"
						errors={errors}
						icon="email"
						name="email"
						handleChange={handleChange}
						values={values}
						keyboardType="email-address"
					/>
				</FieldWrapper>
				<BtnWrapper>
					<Button onPress={handleSubmit} width={40}>
						Enviar
					</Button>
				</BtnWrapper>
			</Form>
		</Container>
	);
};

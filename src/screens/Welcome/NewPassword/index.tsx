import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { Title } from '../../../components/Title';
import { TextInput } from '../../../components/TextInput';
import { Button } from '../../../components/Button';
import { api } from '../../../config/api';
import { useAuth } from '../../../hooks/auth';

import { Container, Description, Form, FieldWrapper, BtnWrapper } from './styles';
import { errorHandler } from '../../../utils/errorInstance';

interface INewPassword {
	values: {
		newPassword: string;
		confirmation: string;
	};
	handleChange: {
		(e: React.ChangeEvent<any>): void;
		<T_1 = string | React.ChangeEvent<any>>(field: T_1): T_1 extends React.ChangeEvent<any>
			? void
			: (e: string | React.ChangeEvent<any>) => void;
	};
	submitForm: () => Promise<void>;
	errors: any;
}

export const NewPassword: React.FC = () => {
	const { updateUser, user } = useAuth();

	const { values, handleChange, submitForm, errors, isValid } = useFormik({
		initialValues: {
			newPassword: '',
			confirmation: '',
		},
		validationSchema: Yup.object({
			newPassword: Yup.string().required('Campo obrigatório'),
			confirmation: Yup.string().required('Campo obrigatório'),
		}),
		onSubmit: async submittedValues => {
			if (submittedValues.newPassword !== submittedValues.confirmation) {
				Alert.alert('Oops!', 'As senhas não coincidem. Tente novamente');
				return false;
			}
			try {
				await api.put('/api/user/v1/alterPassword', submittedValues);
				await updateUser({ ...user, alterPassword: false });

				Alert.alert('Feito.', 'Senha alterada com sucesso');
				return true;
			} catch (e) {
				errorHandler(e, false, message => Alert.alert('Algo deu errado', message as string));
			}
			return false;
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
		<Container>
			<Form>
				<Title fontSize="20px">Senha Provisória</Title>
				<Description>
					Entre com uma nova senha para o E-mail:
					{'email' in user ? user.email : null}
				</Description>
				<FieldWrapper>
					<TextInput
						label="Insira uma nova senha"
						errors={errors}
						icon="lock"
						name="newPassword"
						handleChange={handleChange}
						values={values}
					/>
					<TextInput
						label="Repita a nova senha"
						errors={errors}
						icon="lock"
						name="confirmation"
						handleChange={handleChange}
						values={values}
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

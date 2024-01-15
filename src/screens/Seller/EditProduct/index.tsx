import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import {
	Alert,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	TouchableWithoutFeedback
} from 'react-native';
import * as Yup from 'yup';

import { IProduct } from '../../../@types';
import { Button } from '../../../components/Button';
import { ImagePicker, Miniature } from '../../../components/ImagePicker';
import { SelectList } from '../../../components/SelectList';
import { TextInput } from '../../../components/TextInput';
import { api } from '../../../config/api';
import { useAuth } from '../../../hooks/auth';

import { CategoryResponseType } from '../../../@types/category';
import { colors } from '../../../constants/colors';
import { errorHandler } from '../../../utils/errorInstance';
import { ButtonWrapper, Container, Form, ImgsContainer, ImgsListWrapper, SubTitle } from './styles';

interface IResponse {
	data: string[];
}

interface ICategories {
	nome: string;
	id: number;
}

interface IUnits {
	nome: string;
	id: string;
}

interface IEditProduct {
	navigation: any;
	route: {
		params: IProduct;
	};
}

export const EditProduct: React.FC<IEditProduct> = ({ navigation, route }) => {
	const data = route.params;
	const { user, updateUser, setLoading, token } = useAuth();
	const [categories, setCategories] = useState([] as ICategories[]);
	const [unidadesMedida, setUnidadesMedida] = useState([] as IUnits[]);
	const [categoryValue, setCategoryValue] = useState(data.category || '');
	const [unidadesMedidaValue, setUnidadesMedidaValue] = useState(data.unidadeMedida || '');
	const [pictures, setPictures] = useState(data.pictures);
	const [image, setImage] = useState([] as string[]);
	const [datePicker, setDatePicker] = useState(false);
	const [date, setDate] = useState(new Date(Date.now()));
	const [hour, setHour] = useState(new Date(Date.now()));
	const [datePicker2, setDatePicker2] = useState(false);
	const [date2, setDate2] = useState(new Date(Date.now()));
	const [mode, setMode] = useState('date');
	const [mode2, setMode2] = useState('date');
	const [selectedDateTime, setSelectedDateTime] = useState('');
	const [selectedDateTime2, setSelectedDateTime2] = useState('');



	const handlePrice = (props: any): boolean => {
		return !props
			? false
			: !!props
					.toString()
					.replace(/[^0-9]/g, '')
					.replace(/^[0]+/, '').length;
	};

	useEffect(() => {
		(async () => {
			try {
				const responseUn = await api.get<IResponse>('/api/unidade/v1');
				const response = await api.get<CategoryResponseType>('/api/category/v1');

				if (responseUn.data.data.length > 0) {
					setUnidadesMedida(responseUn.data.data.map(item => ({ nome: item, id: item.split(' - ')[0] })));
				}
				if (response.data.data.content) {
					setCategories(response.data.data.content.map(({ name, id }) => ({ nome: name, id })));
				}
			} catch (e) {
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				errorHandler(e, '/api/unidade/v1 || /api/category/v1', () => {});
			}
		})();
	}, []);

	const { values, handleChange, handleBlur, submitForm, errors, isValid } = useFormik({
		initialValues: {
			name: data.name || '',
			description: data.description || '',
			price: data.price ? (data.price * 100).toString() : '',
			quantityAvailable: data.quantityAvailable.toString() || '',
			categoriaId: data.category || '',
			altura: data.altura ? data.altura.toString() : '',
			comprimento: data.comprimento ? data.comprimento.toString() : '',
			largura: data.largura ? data.largura.toString() : '',
			peso: data.peso ? (data.peso * 1000).toString() : '',
			tpPreparacaoDias: '',
			tpPreparacaoHoras: '',
			tpPreparacaoMinutos: '',
			metrica: data.metrica.toString(),
			unidadeMedida: data.unidadeMedida,
			id: data.id,
			percentageProduct: 0,
			vendedorId: user.id,
			vendedorName: user.firstName,
			min_stock:data.min_stock
		},
		validationSchema: Yup.object({
			name: Yup.string().required('Campo obrigatório'),
			description: Yup.string().required('Campo obrigatório'),
			price: Yup.string().test('price', 'Valor não pode ser 0', props => handlePrice(props)),
			quantityAvailable: Yup.number().test('quantity', 'O Valor não pode ser 0', props => !!props),
			categoriaId: Yup.string().required('Campo obrigatório'),
			unidadeMedida: Yup.string().required('Campo obrigatório'),
			percentageProduct: Yup.number(),
			altura: Yup.number().test('altura', 'O Valor não pode ser 0', props =>
				props && props?.toString().length > 0 ? !!props : true,
			),
			comprimento: Yup.number().test('comprimento', 'O Valor não pode ser 0', props =>
				props && props?.toString().length > 0 ? !!props : true,
			),
			largura: Yup.number().test('largura', 'O Valor não pode ser 0', props =>
				props && props?.toString().length > 0 ? !!props : true,
			),
			peso: Yup.string().test('largura', 'O Valor não pode ser 0', props =>
				props && props?.toString().length > 0 ? !!props : true,
			),
			metrica: Yup.number().test('largura', 'O Valor não pode ser 0', props => !!props),
			tpPreparacaoDias: Yup.number(),
			tpPreparacaoHoras: Yup.number(),
			tpPreparacaoMinutos: Yup.number(),
		}),
		onSubmit: formValues => {
			(async submittedValues => {
				setLoading(true);
				const apiValues = {} as typeof submittedValues;
				Object.keys(submittedValues)
					.filter(value => !!submittedValues[value])
					// eslint-disable-next-line no-return-assign
					.map(filteredValue => (apiValues[filteredValue] = submittedValues[filteredValue]));

				if (!!apiValues.price && !!submittedValues.price) {
					apiValues.price = (parseInt(submittedValues.price.toString().replace(/[^0-9]/g, '')) / 100).toString();
				}
				if (!!apiValues.peso && !!submittedValues.peso) {
					apiValues.peso = (parseInt(submittedValues.peso.toString().replace(/[^0-9]/g, '')) / 1000).toString();
				}

				let response;
				try {

					const dataString = JSON.stringify(apiValues); 
    
					const formDataToSend = new FormData();
					formDataToSend.append("data", dataString);
					image.forEach((value)=>{
						formDataToSend.append('picture', value);
					});

					response = await api.put('api/products/v1/updateProduct', formDataToSend,{headers: {
						'Content-Type': 'multipart/form-data',
						// Adicione outros headers, como o token
						Authorization: `Bearer ${token}`,
					  },});
					const { data: updatedProduct, ...rest } = response.data;
					

					const filteredProducts = user.products?.filter(item => item.id !== updatedProduct.id);
					if (submittedValues.percentageProduct != 0) {
						const product = {
							percentage: submittedValues.percentageProduct,
							productId: data.id,
						};
						try {
							const responsee = await api.post('api/promocaoProduct/v1/newPromotion', product);

							if (responsee.status == 201) {
								console.log('Promocao adicionada');
							}
						} catch (e) {
							// eslint-disable-next-line @typescript-eslint/no-empty-function
						}
					}
					if (filteredProducts) updateUser({ ...user, products: [...filteredProducts, updatedProduct] });
					else updateUser({ ...user, products: updatedProduct });
				} catch (e) {
					console.log(e);
					errorHandler(e, false, message => Alert.alert('Algo deu errado', message as string));
				} finally {
					setLoading(false);
				}

				if (response) {
					if (!image.length) {
						Alert.alert(
							'Feito!',
							'Produto alterado com sucesso',
							[
								{
									text: 'Ok',
									onPress: () => navigation.goBack(),
								},
							],
							{ cancelable: false },
						);
					} else {
						const product = response.data.data;

						try {
							const imageFormData = new FormData();
							image.map((item: string) => {
								return imageFormData.append('picture', { uri: item, type: 'image/jpeg', name: 'imagename.jpg' });
							});

							const updatedProduct = await (
								await api.put(`/api/products/v1/addPictures?productId=${product.id}`, imageFormData)
							).data.data;

							const filteredProducts = user.products?.filter(item => item.id !== product.id);
							if (filteredProducts) updateUser({ ...user, products: [...filteredProducts, updatedProduct] });
							else updateUser({ ...user, products: updatedProduct });

							Alert.alert(
								'Feito!',
								'Produto alterado com sucesso',
								[
									{
										text: 'Ok',
										onPress: () => navigation.goBack(),
									},
								],
								{ cancelable: false },
							);
						} catch (e) {
						
							Alert.alert(
								'Feito!',
								'Produto alterado com sucesso, porém não pudemos atualizar as imagens. Edite seu produto para tentar novamente',
								[
									{
										text: 'Ok',
										onPress: () => navigation.goBack(),
									},
								],
								{ cancelable: false },
							);
						}
					}
				}
				setLoading(false);
			})(formValues);
		},
	});

	const handleSubmit = useCallback(() => {
		if (!isValid) {
			Alert.alert('Oops!', 'Verifique os seus dados e tente novamente');
		} else {
			submitForm();
		}
	}, []);

	const handleDelete = () => {
		Alert.alert('Excluir produto?', 'Tem certeza que quer excluir este produto? Esta ação é irreversível.', [
			{
				text: 'Sim, excluir',
				onPress: async () => {
					setLoading(true);
					try {
						const response = await api.delete(`/api/products/v1/deleteProduct?productId=${data.id}`);

						const { data: products } = response.data;

						updateUser({ ...user, products });
						setLoading(false);
						navigation.goBack();
					} catch (e) {
						
						Alert.alert('Oops.', 'Não foi possível remover o produto.');
					}
					setLoading(false);
				},
			},
			{
				text: 'Cancelar',
			},
		]);
	};

	function showDatePicker(mode: string) {
		setDatePicker(true);
		setMode(mode);
	}
	const onChange2 = (event, value) => {
		setDate2(value);

		if (Platform.OS === 'android') {
			setDatePicker(false);
		}
	};
	function showDatePicker2(mode:string) {
		setDatePicker2(true);
		setMode2(mode)
	}
	const handleDateConfirm = (event, value) => {
		setDate(value);
    const formattedDate = value.toISOString().slice(0, 10);
    const formattedTime = selectedDateTime.slice(11, 19);
    setSelectedDateTime(`${formattedDate} ${formattedTime}`);
		setDatePicker(false);
  };
	const handleTimeConfirm = (event, value) => {
		setDate(value);
    const formattedDate = selectedDateTime.slice(0, 10);
    const formattedTime = value.toLocaleTimeString('en-US', { hour12: false });
    setSelectedDateTime(`${formattedDate} ${formattedTime}`);
		setDatePicker(false);
  };

	return (
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
			<TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
				<SafeAreaView style={{ flex: 1 }}>
					<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
						<Container>
							<Form>
								<SubTitle>Sobre o Produto</SubTitle>
								<TextInput
									label='Qual o nome do seu produto?*'
									errors={errors}
									name='name'
									handleChange={handleChange}
									values={values}
									mode='outlined'
								/>
								<SelectList
									data={categories}
									error={errors}
									name='categoriaId'
									handleChange={(selected: any) => {
										setCategoryValue(selected.value);
										values.categoriaId = selected.value;
									}}
									value={categoryValue}
									label='Qual categoria o descreve melhor?*'
								/>
								<TextInput
									label='Descreva o seu produto*'
									errors={errors}
									name='description'
									handleChange={handleChange}
									values={values}
									mode='outlined'
								/>
								<TextInput
									label='Preço Unitário*'
									errors={errors}
									name='price'
									handleBlur={handleBlur}
									handleChange={handleChange}
									values={values}
									mode='outlined'
									keyboardType='number-pad'
									mask='currency'
								/>
								<SelectList
									data={unidadesMedida}
									error={errors}
									name='unidadeMedida'
									handleChange={(selected: any) => {
										setUnidadesMedidaValue(selected.value);
										values.unidadeMedida = selected.value;
									}}
									value={unidadesMedidaValue}
									label='Unidade de Medida*'
								/>
								<TextInput
									label='Medida (mm, cm ou dm)*'
									errors={errors}
									name='metrica'
									placeholder='Valor da Unidade de Medida'
									handleChange={handleChange}
									values={values}
									keyboardType='number-pad'
									mode='outlined'
								/>
								<TextInput
									label='Qual a quantidade disponível?*'
									errors={errors}
									name='quantityAvailable'
									handleChange={handleChange}
									values={values}
									keyboardType='number-pad'
									mode='outlined'
								/>
								<TextInput
								label="Qual é o stock minimo?*"
								errors={errors}
								name="min_stock"
								handleChange={handleChange}
								values={values}
								keyboardType="number-pad"
								mode="outlined"
								/>
								<SubTitle>Sobre a embalagem</SubTitle>
								<TextInput
									label='Qual o peso?(kg)*'
									errors={errors}
									name='peso'
									handleChange={handleChange}
									values={values}
									keyboardType='number-pad'
									mode='outlined'
									mask='weightInput'
								/>
								<TextInput
									label='Qual a altura?(cm)'
									errors={errors}
									name='altura'
									handleChange={handleChange}
									values={values}
									keyboardType='number-pad'
									mode='outlined'
								/>
								<TextInput
									label='Qual o comprimento?(cm)'
									errors={errors}
									name='comprimento'
									handleChange={handleChange}
									values={values}
									keyboardType='number-pad'
									mode='outlined'
								/>
								<TextInput
									label='Qual a largura?(cm)'
									errors={errors}
									name='largura'
									handleChange={handleChange}
									values={values}
									keyboardType='number-pad'
									mode='outlined'
								/>
								<SubTitle>Promoção do produto</SubTitle>
								<TextInput
									label='Diga a percentagem?'
									errors={errors}
									name='percentageProduct'
									handleChange={handleChange}
									values={values}
									keyboardType='number-pad'
									mode='outlined'
								/>
   					
								<SubTitle>Foto</SubTitle>
								{!!pictures.length && (
									<ImgsContainer scrollEnabled>
										<ImgsListWrapper>
											{pictures.map((item, index) => (
												<Miniature
													key={index}
													uri={item}
													icon='trash'
													handleOnPress={async () => {
														Alert.alert(
															'Remover imagem',
															'Tem certeza que deseja remover esta imagem? Esta ação é irreversível.',
															[
																{
																	text: 'Sim, remover',
																	onPress: async () => {
																		try {
																			const response = await api.delete(
																				`api/products/v1/removePicture?pictureUrl=${item}&productId=${data.id}`,
																			);
																			const updatedProduct = response.data.data;
																			setPictures(updatedProduct.pictures);

																			const filteredProducts = user?.products
																				? user.products.filter(product => product.id !== updatedProduct.id)
																				: [];

																			updateUser({ ...user, products: [...filteredProducts, updatedProduct] });
																		} catch (e) {
																			Alert.alert('Oops.', 'Não foi possível remover a imagem');
																		}
																	},
																},
																{
																	text: 'Cancelar',
																},
															],
														);
													}}
												/>
											))}
										</ImgsListWrapper>
									</ImgsContainer>
								)}
								<ImagePicker image={image} setImage={setImage} />
								<ButtonWrapper>
									<Button onPress={handleSubmit} width={45}>
										Salvar
									</Button>
									<Button onPress={handleDelete} width={45} backgroundColor={colors.default.red}>
										Excluir
									</Button>
								</ButtonWrapper>
							</Form>
						</Container>
					</ScrollView>
				</SafeAreaView>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

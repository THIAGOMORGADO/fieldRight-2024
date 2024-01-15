import * as ExpoImagePicker from 'expo-image-picker';
import React, { useEffect } from 'react';
import { Alert, Platform } from 'react-native';

import { Button } from '../Button';

import { api } from '../../config/api';
import { useAuth } from '../../hooks/auth';
import { errorHandler } from '../../utils/errorInstance';
import { Container, Icon, IconWrapper, Image, ListWrapper, MiniatureWrapper, Text } from './styles';

interface ILogo {
	img: string;
	imageHash: string;
}

interface IImagePicker {
	image: string[];
	setImage: React.Dispatch<React.SetStateAction<string[]>>;
	children?: any;
	title?: string;
	autoUpload?: boolean;
}

export const ImagePicker: React.FC<IImagePicker> = ({ image, setImage, title, autoUpload }) => {
	const { user, updateUser, setLoading } = useAuth();

	const uploadImgUser = async (img: string) => {
		setLoading(true);

		const data = new FormData();
		// 👇️ ts-ignore ignores any ts errors on the next line
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		data.append('picture', { uri: img, type: 'image/jpeg', name: 'imagename.jpg' });

		try {
			const avatar = await (await api.put('/images', data)).data;
			updateUser({ ...user, avatar });
		} catch (e) {
			//console.log({ uploadLogoErr: e });
			errorHandler(e, '/images', message => Alert.alert('Não foi possível fazer upload!', message as string));
		}
		setLoading(false);
	};
	useEffect(() => {
		(async () => {
			if (Platform.OS !== 'web') {
				const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
				if (status !== 'granted') {
					// eslint-disable-next-line no-alert
					alert('Sorry, we need camera roll permissions to make this work!');
				}
			}
		})();
	});

	const pickImage = async (): Promise<void> => {
		const result = await ExpoImagePicker.launchImageLibraryAsync({
			mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
			allowsMultipleSelection: false,
			quality: 1,
		});

		if (!result.cancelled) {
			if (autoUpload) uploadImgUser(result.assets[0]?.uri);
			else setImage([...image, result.assets[0]?.uri]);
		}
	};

	return (
		<>
			<Button onPress={pickImage}>{title || 'Selecionar Imagens'}</Button>
			{!autoUpload && (
				<Container scrollEnabled>
					<ListWrapper>
						{image.length ? (
							image.map((uri, index) => (
								// eslint-disable-next-line max-len
								<Miniature key={index} uri={uri} handleOnPress={() => setImage(image.filter(img => img !== uri))} />
							))
						) : (
							<Text>Nenhuma imagem selecionada</Text>
						)}
					</ListWrapper>
				</Container>
			)}
		</>
	);
};

interface IMiniature {
	uri: string;
	icon?: string;
	handleOnPress?: () => void | Promise<void>;
}

export const Miniature: React.FC<IMiniature> = ({ uri, icon, handleOnPress }) => {
	return (
		<MiniatureWrapper onPress={handleOnPress}>
			<IconWrapper>
				<Icon name={icon || 'x'} />
			</IconWrapper>
			<Image source={{ uri }} />
		</MiniatureWrapper>
	);
};

import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { IProduct } from '../../../@types';
import NumberFormat from '../../../utils/NumberFormat';
import { imgNotFound } from '../../../constants/imgNotFound';
import { useAuth } from '../../../hooks/auth';
import {Image} from "react-native"
import { Container, Weight, WeightWrapper, Header, Footer, Icon, Img, Title, Price} from './styles';
import { colors } from '../../../constants/colors';
import { BuyerTabScreenProps, SellerTabScreenProps } from '../../../types/navigation';

interface IData extends IProduct {
	isFavorite: boolean;
}

type ProductCardProps = {
	data: IData;
	handleFavorites?: (id: number) => Promise<void>;
	hideFavoriteIcon?: boolean;
};

export const ProductCard: React.FC<ProductCardProps> = ({ data, handleFavorites, hideFavoriteIcon }) => {
	const navigation = useNavigation<BuyerTabScreenProps>();
	const navigationSeller = useNavigation<SellerTabScreenProps>();
	const { perfil } = useAuth().user;

	const [favorite, setFavorite] = useState(data.isFavorite);
	const image = !!data.pictures?.length && !!data.pictures[0] ? { uri: data.pictures[0] } : imgNotFound;

	const handleFavorite = (id: number): void => {
		if (hideFavoriteIcon && handleFavorites) handleFavorites(id);
		setFavorite(!favorite);
	};

	function handleNavigateUser(): void {
		if (perfil === 'comprador') {
			navigation.navigate('Product', data);
		} else {
			navigationSeller.navigate('EditProduct', data);
		}
	}

	return (
		<Container onPress={() => handleNavigateUser()}>
			<Header>
				{data.unidadeMedida && (
					<WeightWrapper>
						<Weight>{data.metrica + data.unidadeMedida}</Weight>
					</WeightWrapper>
				)}
				{!hideFavoriteIcon && (
					<Icon
						name='heart'
						favorite={favorite}
						onPress={() => {
							handleFavorite(data.id);
						}}
					/>
				)}
			</Header>
			{!image.uri ? (
				<Img source={image} style={{ borderTopLeftRadius: 4, borderTopRightRadius: 4 }} />
			) : (
				<Image
					style={{
						flex: 1,
						width: 180,
						maxWidth: '100%',
						height: 140,
						marginBottom: 8,
						backgroundColor: colors.default.bgGray,
						borderTopLeftRadius: 4,
						borderTopRightRadius: 4,
					}}
					source={{
						uri: image.uri,
						// headers: { Authorization: 'Bearer ' },
						//priority: FastImage.priority.high,
					}}
					//resizeMode={FastImage.resizeMode.cover}
					resizeMode={'cover'}
				/>
			)}

			<Footer>
				<Title>{data.name}</Title>
				<Price>{"R$ "+data.price}</Price>
			</Footer>
		</Container>
	);
};
//{NumberFormat.currency(data.price)}

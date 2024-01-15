import React from 'react';
import { FlatList } from 'react-native';
import { IRoute } from '../../../@types';
import { IProduct } from '../../../@types/products';
import { useAuth } from '../../../hooks/auth';
import { Loader } from '../../Loader';
import { NotFound } from '../../NotFound';
import { ProductCard } from '../ProductCard';
import { ProductSubCard } from '../ProductSubCard';

type ProductListProps = {
	store:boolean;
	products: IProduct[];
	favoritesList?: number[];
	route: IRoute;
	isLoading?: boolean;
	isLastPage?: boolean;
	hideFavoriteIcon?: boolean;
	onRefresh?: () => void;
	onEndReached?: () => void;
};

export const ProductList: React.FC<ProductListProps> = ({
	products,
	favoritesList,
	route,
	isLoading,
	isLastPage,
	hideFavoriteIcon = false,
	onRefresh,
	onEndReached,
	store
}) => {
	const { favorites } = useAuth();

	const handleRefresh = () => {
		if (onRefresh) onRefresh();
	};

	const handleEndReached = () => {
		if (onEndReached) onEndReached();
	};

	return (
		<FlatList
			data={products}
			renderItem={({ item: product }) => (
				store?
				<ProductCard
					key={product.id}
					data={{ ...product, isFavorite: favoritesList?.some(key => key === product.id) || false }}
					handleFavorites={favorites.handleFavorites}
					hideFavoriteIcon
				/>:
				<ProductSubCard
					key={product.id}
					data={{ ...product, isFavorite: favoritesList?.some(key => key === product.id) || false }}
					handleFavorites={favorites.handleFavorites}
					hideFavoriteIcon
				/>
			)}
			ListEmptyComponent={
				<NotFound
					message={`Infelizmente, Nenhum produto foi encontrado na loja${
						route?.params?.nomeLoja ? ` "${route.params.nomeLoja}"` : ''
					}.\n\nTente pesquisar em outra loja.`}
					isLoading={isLoading}
				/>
			}
			ListFooterComponent={<Loader isLoading={false || false} />}
			initialNumToRender={8}
			horizontal={false}
			numColumns={2}
			keyExtractor={(item, index) => index.toString()}
			refreshing={isLoading}
			onRefresh={handleRefresh}
			onEndReached={handleEndReached}
			onEndReachedThreshold={0.5}
			style={{height:"85%"}}
		/>
	);
};

export default ProductList;

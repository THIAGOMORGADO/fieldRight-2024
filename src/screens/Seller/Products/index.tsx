import { AntDesign } from '@expo/vector-icons';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useState } from 'react';
import { TextInput, View } from "react-native";
import { IProduct, IRoute, IStore } from '../../../@types';
import { ProductList } from '../../../components/product/ProductList';
import { api } from '../../../config/api';
import { useAuth } from '../../../hooks/auth';
import { Icon, ProductsHeader, ProductsNewBtn, ProductsNewBtnText, ProductsTitle, ProductsWrapper } from './styles';
type ProductsComponentProps = {
	navigation?: any;
	route?: any;
};

export function Products({ navigation, route }: ProductsComponentProps): any {
	const { user } = useAuth();
	const [product, setProduct] = useState<IProduct[]>([]);
	const [isLoading, setIsLoading] = useState(false)
	const [filteredData, setFilteredData] = useState<IStore[]>([]); //Receberá lista filtrada
	const [masterData, setMasterData] = useState<IStore[]>([]); //Lista a ser renderizada
	const [text, setText] = useState(''); //Controla value do input

	const getProducts = useCallback(() => {
		(async () => {
		try {
			const res = await api.get(`api/lojas/v1/products/filters?loja=${user.id}`);
			setProduct(res.data.data.content);
			setFilteredData(res.data.data.content);
			setMasterData(res.data.data.content);
		} catch (error) {
			
		} finally {
			setIsLoading(false)
		}
	})();
	},[]);

	const searchFilter = async (text) =>{
		
		if(text){
			try {
				setIsLoading(true);
				const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
				await delay(300);
				const res = await api.get(`api/lojas/v1/products/filters?loja=${user.id}&nome=${text}`);
				console.log(res.data.data.content[0]);
				setFilteredData(res.data.data.content);
			} catch (error) {
				
			}finally {
				setIsLoading(false);
			}
		}else{
			setFilteredData(masterData);
		}
	};
	
	// Debounce para a função searchFilter
	const debouncedSearchFilter = debounce(searchFilter, 300);
	useEffect(() => {
		// Limpar o debounce quando o componente for desmontado
		return () => debouncedSearchFilter.cancel();
	  }, []);
	
	
	useEffect(() => {
		(async () => {
			const listener = navigation.addListener('focus', () => {
				getProducts();
			});

			return listener;
		})();
	}, [navigation]);

	useEffect(() => {
		getProducts();
	}, []);

	return (
		<ProductsWrapper>
			<ProductsHeader>
				<ProductsTitle>Meus Produtos</ProductsTitle>

				<ProductsNewBtn onPress={() => navigation.navigate('NewProduct')}>
					<Icon name='plus' />
					<ProductsNewBtnText>Adicionar Produto</ProductsNewBtnText>
				</ProductsNewBtn>
			</ProductsHeader>
			<View style={{flexDirection:"row", justifyContent:"space-around", alignItems:"center"}}>

			<AntDesign name='search1' size={20}  />
			<TextInput

							value={text}
							onChangeText={(t) => {
								setText(t);
								debouncedSearchFilter(t);
							  }}

								placeholder='Pesquisar produtos?'
								style={{ width: '90%',  fontSize: 16, color: 'black',  padding: 8, borderRadius:10}}
							/>
								</View>
			<ProductList
				products={filteredData}
				route={route as IRoute}
				isLoading={isLoading}
				hideFavoriteIcon={false}
				store={true}

			/>
		</ProductsWrapper>
	);
}

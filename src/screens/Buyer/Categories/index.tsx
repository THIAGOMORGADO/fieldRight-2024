import React, { useState, useEffect,useCallback } from 'react';
import { CategoryType, ICategories, IStore, IStores,IProduct } from '../../../@types';
import { StoresWrapper } from './styles';
import { LogBox,Animated } from 'react-native';
import { api } from '../../../config/api';
import { NotFound } from '../../../components/NotFound';
import { errorHandler } from '../../../utils/errorInstance';
import { useAuth } from '../../../hooks/auth';
import { colors } from '../../../constants/colors';
import {Day, Weeknd, Today} from "../../../utils/formatDate"
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { COLORS, FONTS, SIZES, dummyData } from '../../../constants';
import { HorizontalFoodCard, VerticalFoodCard } from '../../../components';
//import ShimmerPlaceholder from "../../../components/ShimmerPlaceholder"
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
//import LinearGradient from 'react-native-linear-gradient';
const Section = ({ title, onPress, children }) => {
	return (
		<View>
			<View
				style={{
					flexDirection: 'row',
					marginHorizontal: SIZES.padding,
					marginTop: 30,
					marginBottom: 20,
				}}
			>
				<Text style={{ flex: 1, color: colors.default.green, ...FONTS.h3 }}>{title}</Text>
				<TouchableOpacity onPress={onPress}>
					<Text style={{ color: colors.default.green, ...FONTS.body3 }}>Mostrar todas</Text>
				</TouchableOpacity>
			</View>
			{children}
		</View>
	);
};
export const Categories: React.FC<{ navigation: any }> = ({ navigation }) => {
	//const {product}=getProductAll();
	const [selectedCategoryId, setSelectedCategoryId] = React.useState(1);
	const [selectedSuperCategoryId, setSelectedSuperCategoryId] = React.useState(1);
	const [selectedMenuType, setSelectedMenutype] = React.useState(1);
	const [selectedMenu, setSelectedMenu] = React.useState(1);
	const [menuList, setMenuList] = React.useState([]);
	const [recommend, setRecommend] = React.useState([]);
	const [product, setProduct] = useState<IProduct[]>([]);
	const [productFilter, setProductFilter] = useState<IProduct[]>([]);
	const [popular, setPopular] = React.useState<IStore[]>([]);
	const { favorites } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [favoritesList, setFavoritesList] = useState<number[]>([]);
	const [storeList, setStoreList] = useState<IStore[]>([]);
	const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
	const [SupercategoryList, setSuperCategoryList] = useState<CategoryType[]>([]);
	const [change, setChange] = useState(false);
	const [date, setDate] = useState(change?Day():Weeknd());
	LogBox.ignoreAllLogs();


  

	const getStores = useCallback(() => {
		(async () => {
		try {
			const response = await api.get('api/lojas/v1');
			const stores: IStores = response.data.data;
			setStoreList(stores.content);
		} catch (e) {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			errorHandler(e, 'api/lojas/v1', () => {});
		}
	})();
	},[]);

	const getCategory = async () => {
		try {
			const response = await api.get('api/category/v1/all-product');
			const categories = response.data.data;

			setCategoryList(categories);
		} catch (e) {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			errorHandler(e, 'api/category/v1/', () => {});
		}
	};

	const getSuperCategory = async () => {
		setIsLoading(true);
		try {
			const response = await api.get('api/superCategory/v1/all-company');
			const categories = response.data.data;
			setSuperCategoryList(categories);
		} catch (e) {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			errorHandler(e, 'api/category/v1', () => {});
		}
		setIsLoading(false);
	};

	const getProduct = async () => {
		try {
			const res = await api.get(`api/lojas/v1/products/filters`);
			setProduct(res.data.data.content);
		} catch (error) {
			console.log('erro ao carregar os produtos', error);
		} finally {
		}
	};
	const getProductFilter = async (start, end) => {
		try {
			const res = await api.get(`api/lojas/v1/products/filters?startDate=${end}&endDate=${start}`);
			setProductFilter(res.data.data.content);
			
		} catch (error) {
			console.log('erro ao carregar os produtos', error);
		} finally {
		}
	};

	useEffect(() => {
		(async () => {
		getStores();
		getSuperCategory();
		getCategory();
		getProduct();
	
	})();
	}, []);

	useEffect(() => {
		(async () => {
			if(selectedMenu==1){
				getProductFilter(Today(),Day());
			}else{
				getProductFilter(Today(),Weeknd());
			}
	
	})();
	}, [selectedMenu]);


	function renderMenuTypes() {
		return (
			<FlatList
				horizontal
				data={dummyData.menu}
				keyExtractor={item => `${item.id}`}
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					marginTop: 30,
					marginBottom: 20,
				}}
				renderItem={({ item, index }) => {
					return (
						<TouchableOpacity
							style={{
								marginLeft: SIZES.padding,
								marginRight: index === dummyData.menu.length - 1 ? SIZES.padding : 0,
							}}
							onPress={() => {
								setSelectedMenutype(item.id);
								setSelectedMenu(item.id)
							
							}}
						>
							<Text
								style={{
									color: selectedMenuType == item.id ? colors.default.green : COLORS.black,
									...FONTS.h3,
								}}
							>
								{item.name}
							</Text>
						</TouchableOpacity>
					);
				}}
			/>
		);
	}

	function renderRecommendedSection() {
		return (
			<Section title='Destaque' onPress={() => console.log('Recomendado')}>
				<FlatList
					data={product}
					keyExtractor={item => `${item.id}`}
					horizontal
					showsHorizontalScrollIndicator={false}
					renderItem={({ item, index }) => {
						return (
							<HorizontalFoodCard
								containerStyle={{
									height: 180,
									width: SIZES.width * 0.85,
									marginLeft: index == 0 ? SIZES.padding : 18,
									marginRight: index == recommend.length - 1 ? SIZES.padding : 0,
									paddingRight: SIZES.radius,
									alignItems: 'center',
								}}
								imageStyle={{
									marginTop: 1,
									height: '100%',
									width: 150,
								}}
								item={item}
								onPress={() => navigation.navigate('Product', item)}
							/>
						);
					}}
				/>
			</Section>
		);
	}
	function renderPopularSection() {
		return (
			<Section title='Lojas' onPress={() => navigation.navigate('Shops',{id:0,store:false})}>
				<FlatList
					data={storeList}
					keyExtractor={item => `${item.id}`}
					horizontal
					showsHorizontalScrollIndicator={false}
					renderItem={({ item, index }) => {
						return (
							<VerticalFoodCard
								containerStyle={{
									marginLeft: index == 0 ? SIZES.padding : 18,
									marginRight: index == popular.length - 1 ? SIZES.padding : 0,
								}}
								item={item}
								onPress={() => navigation.navigate('Products', {category:'', id:item.id,store:true})}
							/>
						);
					}}
				/>
			</Section>
		);
	}

	function renderFoodCategories() {
		return (
			<FlatList
				data={categoryList}
				keyExtractor={item => `${item.id}`}
				horizontal
				showsHorizontalScrollIndicator={false}
				renderItem={({ item, index }) => {
					return (
						<TouchableOpacity
							style={{
								flexDirection: 'row',
								height: 55,
								
								marginLeft: index == 0 ? SIZES.padding : SIZES.radius,
								marginRight: index == dummyData.categories.length - 1 ? SIZES.padding : 0,
								paddingHorizontal: 4,
								borderRadius: SIZES.radius,
								backgroundColor: colors.default.green,
							}}
							onPress={() => {
								navigation.navigate('Products',  {category:item.name, id:item.id,store:false} )
							}}
						>
							<Image
								source={{
									uri: item.pictures[0],
								}}
								resizeMode={'cover'}
								style={{
									marginTop: 2,
									width: 50,
									height: 50,
								}}
							/>
							<Text
								style={{
									alignSelf: 'center',
									color: COLORS.white,
									textAlign: 'center',
									...FONTS.h3,
								}}
							>
								{item.name}
							</Text>
						</TouchableOpacity>
					);
				}}
			/>
		);
	}
	function renderSuperCategory() {
		return (
			<FlatList
				data={SupercategoryList}
				keyExtractor={item => `${item.id}`}
				horizontal
				showsHorizontalScrollIndicator={false}
				renderItem={({ item, index }) => {
					return (
						
						<TouchableOpacity
							style={{
								flexDirection: 'row',
								height: 55,
								marginLeft: index == 0 ? SIZES.padding : SIZES.radius,
								marginRight: index == dummyData.categories.length - 1 ? SIZES.padding : 0,
								paddingHorizontal: 4,
								borderRadius: SIZES.radius,
								backgroundColor: colors.default.green,
							}}
							onPress={() => navigation.navigate('Shops', {id:item.id,store:true})}
						>
						{/*<ShimmerPlaceHolder
						style={{ height:"100%", margin: 10, borderRadius: 10}}
						autoRun={true}
						visible={isLoading}
						LinearGradient={LinearGradient
						>
      					</ShimmerPlaceHolder>*/}
					
							<Image
								source={{
									uri: item.pictures[0],
								}}
								resizeMode={'cover'}
								style={{
									marginTop: 2,
									width: 50,
									height: 50,
									
								}}
							/>
							
							<Text
								style={{
									alignSelf: 'center',
									color: COLORS.white,
									textAlign: 'center',
									...FONTS.h3,
								}}
							>
								{item.nome}
							</Text>
					
						</TouchableOpacity>
					);
				}}
			/>
		);
	}

	function renderDeliveryTo() {
		return (
			<View
				style={{
					marginTop: SIZES.padding,
				}}
			>
				<Section title='Subcategorias' onPress={() => navigation.navigate('Category')}></Section>
			</View>
		);
	}
	function SectionSuperCategory() {
		return (
			<View
				style={{
					marginTop: SIZES.padding,
				}}
			>
				<Section title='Categorias' onPress={() => navigation.navigate('SuperCategory')}></Section>
			</View>
		);
	}
	return (
		<StoresWrapper>
			{/*renderSearch()*/}

			<FlatList
				data={productFilter}
				keyExtractor={item => `${item.id}`}
				showsHorizontalScrollIndicator={false}
				ListHeaderComponent={
					<View>
						{SectionSuperCategory()}
						{renderSuperCategory()}
						{renderDeliveryTo()}
						{renderFoodCategories()}
						{renderPopularSection()}
						{renderRecommendedSection()}
						{renderMenuTypes()}
					</View>
				}
				renderItem={({ item, index }) => {
					return (
						<HorizontalFoodCard
							containerStyle={{
								height: 130,
								alignItems: 'center',
								marginHorizontal: SIZES.padding,
								marginBottom: SIZES.radius,
							}}
							imageStyle={{
								height: 110,
								width: 110,
							}}
							item={item}
							onPress={() => navigation.navigate('Product', item)}
						/>
					);
				}}
				ListFooterComponent={<View style={{ height: 200 }} />}
			/>
		</StoresWrapper>
	);
};

export default Categories;

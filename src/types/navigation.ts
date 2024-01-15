import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CartCheckoutProps } from './screens/buyer/cart';

export type WelcomeTabParamList = {
	IntroApp: undefined;
	IntroBuyer: undefined;
	IntroDriver: undefined;
	IntroSeller: undefined;
	SignIn: undefined;
	SignInType: undefined;
	SelectUserType: undefined;
	AboutUs?: {
		headerShown?: string;
		headerTitle?: string;
		headerStyle?: { backgroundColor: string };
		headerTitleStyle?: { color: string };
		headerTintColor?: string;
	};
};

export type AuthTabParamList = {
	SignIn?: { profile?: string };
	ForgotPassword: undefined;
	Buyer: undefined;
	Driver: undefined;
	Seller: undefined;
};

export type RegisterTabParamList = {
	SelectUserType?: {
		headerTitle?: string;
		headerStyle?: { backgroundColor: string };
		headerTitleStyle?: { color: string };
		headerTintColor?: string;
	};
	SignUp?: {
		headerTitle?: string;
		profile?: string;
	};
	Terms?: {
		headerTitle?: string;
	};
	Entrega?: {
		headerTitle?: string;
	};
	Privacy?: {
		headerTitle?: string;
	};
	DriverTerms?: {
		headerTitle?: string;
	};
};

export type BuyerTabParamList = {

	Home?: { headerShown?: boolean };
	HomeBuyer?: { headerTitle?: boolean; isName: string};
	Cart?: { headerTitle?: boolean };
	Stores?: { headerTitle?: boolean };
	Products?: { headerTitle?: boolean; category:string;id:number;store:boolean };
	ProductSearch?: { headerTitle?: boolean;};
	SuperCategorySearch?:{ headerTitle?: boolean; isName: string};
	CategorySearch?:{ headerTitle?: boolean; isName: string};
	Shops?: { headerTitle?: boolean; id: number, store: boolean};
	Category?: { headerTitle?: boolean; isName: string;};
	SuperCategory?: { headerTitle?: boolean; isName: string;};
	ShopSearch?: { headerTitle?: boolean; isName: string};
	Product?: { headerTitle?: boolean; isFavorite?: boolean; };
	Checkout?: { cartCheckout?: CartCheckoutProps[] };
	CheckoutAddress?: { cartCheckout?: CartCheckoutProps[] };
	Profile?: { headerTitle?: boolean };
	CartPayment?: { headerTitle?: boolean };
	OtherPayment?: { headerTitle?: boolean };
	BankData?: { headerTitle?: boolean };
	Orders?: { headerTitle?: boolean };
	OrderDetails?: { headerTitle?: boolean };
	CheckoutCard: undefined;
	CheckoutConfirm: { taxaEntrega: any; cartCheckoutUpdated: any };
};

export type DriverTabParamList = {
	Home?: { headerShown?: boolean };
	Profile?: { headerTitle?: string };
	ChooseStores?: { headerTitle?: string };
	BankData?: { headerTitle?: string };
};

export type SellerTabParamList = {
	Home?: { headerShown?: boolean };
	NewProduct?: { headerTitle?: string };
	EditProduct?: { headerTitle?: string; isFavorite?: boolean };
	Profile?: { headerTitle?: string };
	BankData?: { headerTitle?: string };
	SalesHistory?: { headerTitle?: string };
	Entrega?: { headerTitle?: string };
};

export type AdminTabParamList = {
	Dashboard: undefined;
};

export type RootStackParamList = {
	Welcome: undefined;
	Login: undefined;
	Register?: {
		screen?: keyof RegisterTabParamList;
	};
	Buyer: undefined;
	Driver: undefined;
	Seller: undefined;
	Admin: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = StackNavigationProp<RootStackParamList, T>;

export type WelcomeTabScreenProps = CompositeNavigationProp<
	StackNavigationProp<WelcomeTabParamList>,
	BottomTabNavigationProp<RootStackParamList, 'Welcome'>
>;

export type AuthTabScreenProps = CompositeNavigationProp<
	StackNavigationProp<AuthTabParamList>,
	BottomTabNavigationProp<RootStackParamList, 'Login'>
>;

export type RegisterTabScreenProps = CompositeNavigationProp<
	StackNavigationProp<RegisterTabParamList>,
	BottomTabNavigationProp<RootStackParamList, 'Register'>
>;

export type BuyerTabScreenProps = CompositeNavigationProp<
	StackNavigationProp<BuyerTabParamList>,
	BottomTabNavigationProp<RootStackParamList, 'Buyer'>
>;

export type DriverTabScreenProps = CompositeNavigationProp<
	StackNavigationProp<DriverTabParamList>,
	BottomTabNavigationProp<RootStackParamList, 'Driver'>
>;

export type SellerTabScreenProps = CompositeNavigationProp<
	StackNavigationProp<SellerTabParamList>,
	BottomTabNavigationProp<RootStackParamList, 'Seller'>
>;

export type AdminTabScreenProps = CompositeNavigationProp<
	StackNavigationProp<AdminTabParamList>,
	BottomTabNavigationProp<RootStackParamList, 'Admin'>
>;

import { IPagination, IResponse } from './requests';
import { CountryList, IEndereco } from './user';

export interface IStore {
	avatar: string;
	id: number;
	nomeLoja: string;
	category: string;
	store:boolean;
}

export interface IStores {
	content: IStore[];
	empty: boolean;
	first: boolean;
	last: boolean;
	number: number;
	numberOfElements: number;
	pageable: IPagination;
	size: number;
	sort: {
		empty: boolean;
		sorted: boolean;
		unsorted: boolean;
	};
	totalElements: number;
	totalPages: number;
}

type EnderecoWithoutPais = Omit<IEndereco, 'pais'>;
export interface IEnderecoLoja extends EnderecoWithoutPais {
	pais: CountryList;
}

export interface IStoreList extends IResponse {
	content: IStore[];
}

export type ResponseStoreProps = {
	data: IStoreList;
};

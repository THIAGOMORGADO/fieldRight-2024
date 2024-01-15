import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { SaleCard } from '../../../components/SaleCard';
import { IEndereco, IVenda } from '../../../@types';
import { Title } from '../../../components/Title';
import { api } from '../../../config/api';
import { Loader } from '../../../components/Loader';
import { NotFound } from '../../../components/NotFound';

import { ProductsWrapper, ProductsHeader, ListWrapper } from './styles';
import { vendasFilter } from '../../../utils/vendasFilter';

export const Sales: React.FC<{ navigation: any }> = ({ navigation }) => {
	const [vendas, setVendas] = useState<IVenda[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const source = 'sales';

	const getVendas = useCallback(() => {
		(async () => {
			setIsLoading(true);
			try {
				const response = await api.get(`api/vendas/v1`);
				const responseVendas: IVenda[] = vendasFilter(response.data.data, [
					'NOVA',
					'EM_PREPARACAO',
					'AGUARDANDO_ENTREGADOR',
				]);
				setVendas(responseVendas);
			} catch (error) {
			
				Alert.alert('Oops', 'Não foi possível carregar os seus pedidos.');
			}
			setIsLoading(false);
		})();
	}, []);



	useEffect(() => {
		(async () => {
			const listener = navigation.addListener('focus', getVendas);

			return listener;
		})();
	}, [navigation]);

	return (
		<ProductsWrapper scrollEnabled>
			<ProductsHeader>
				<Title fontSize="20px">Minhas Vendas</Title>
			</ProductsHeader>

			{isLoading ? (
				<Loader isLoading={isLoading}/>
			) : (
				<ListWrapper>
					{vendas.length ? (
						vendas.map((venda, index) => {
							const endereco: IEndereco = {
								rua: venda.compras[0].enderecoEntrega.rua,
								bairro: venda.compras[0].enderecoEntrega.bairro,
								cidade: venda.compras[0].enderecoEntrega.cidade,
								estado: venda.compras[0].enderecoEntrega.estado,
								complemento: venda.compras[0].enderecoEntrega.complemento,
								numero: venda.compras[0].enderecoEntrega.numero,
								cep: venda.compras[0].enderecoEntrega.cep,
								pais: undefined,
							};
							const saleCardAdditionalProps: {
								venda: typeof venda;
								setIsLoading: typeof setIsLoading;
								setVendas: typeof setVendas;
								source: 'sales' | 'salesHistory';
								endereco: typeof endereco;
							} = {
								venda,
								setIsLoading,
								setVendas,
								source,
								endereco,
							};

							return <SaleCard key={venda.id} {...saleCardAdditionalProps} />;
						})
					) : (
						<NotFound message="Nenhuma venda para exibir" />
					)}
				</ListWrapper>
			)}
		</ProductsWrapper>
	);
};

import React from 'react';
import { useNavigation } from '@react-navigation/native';

import { Button } from '../../../components/Button';

import { Container } from './styles';
import { DriverTabScreenProps } from '../../../types/navigation';

export const User: React.FC = () => {
	const navigation = useNavigation<DriverTabScreenProps>();

	return (
		<Container>
			<Button onPress={() => navigation.navigate('Profile')}>Meus Dados</Button>
			<Button onPress={() => navigation.navigate('ChooseStores')}>Escolher Lojas para Trabalhar</Button>
			<Button onPress={() => navigation.navigate('BankData')}>Dados Bancários</Button>
		</Container>
	);
};

export type CidadeAtuacaoType = {
	codigoMunicipio: number;
	codigoUF: number;
	id: number;
	nomeMunicipio: string;
	nomeUF: string;
	pais: string;
	siglaUF: string;
};

export type IIBGEMunicipiosResponse = {
	id: number;
	nome: string;
	microrregiao: {
		id: number;
		nome: string;
		mesorregiao: {
			id: number;
			nome: string;
			UF: {
				id: number;
				sigla: string;
				nome: string;
				regiao: {
					id: number;
					sigla: string;
					nome: string;
				};
			};
		};
	};
	'regiao-imediata': {
		id: number;
		nome: string;
		'regiao-intermediaria': {
			id: number;
			nome: string;
			UF: {
				id: number;
				sigla: string;
				nome: string;
				regiao: {
					id: number;
					sigla: string;
					nome: string;
				};
			};
		};
	};
};

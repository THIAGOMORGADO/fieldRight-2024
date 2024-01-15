import { IEndereco } from '../../../@types';

export type CartCheckoutProps = {
  productId: number;
  enderecoLoja: IEndereco;
  qtdComprada: number;
  vlPago: number;
  unidadeMedida:string;
  productPrice:number;
  vendedorId:number;
};

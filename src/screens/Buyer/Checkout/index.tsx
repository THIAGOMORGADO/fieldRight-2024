import React from 'react';
import { BuyerCheckoutTabs } from '../routes';

import { CartItem } from '../../../@types/products';
import { IEndereco } from '../../../@types/user';

interface iCheckout {
  navigation: any;
  route: {
    params: {
      key: string;
      name: string;
      cartCheckout: ICartItem[];
    };
  };
}

interface ICartItem extends CartItem {
  vlPago: number;
  endereco: IEndereco;
}

export const Checkout: React.FC<iCheckout> = ({ route }) => <BuyerCheckoutTabs params={route.params} />;

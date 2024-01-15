import React from 'react';

import { Container, Text } from './styles';

export type NotFoundComponentProps = {
  message: string;
  isLoading?: boolean;
};

export const NotFound: React.FC<NotFoundComponentProps> = ({ message, isLoading }) => {
  return (
    <Container>
      <Text>{!isLoading ? message : 'Carregando...'}</Text>
    </Container>
  );
};

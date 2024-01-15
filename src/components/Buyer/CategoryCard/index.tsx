import React, { useCallback, useEffect, useState } from 'react';
import { CategoryType } from '../../../@types';
import { Container, Header, Icon, Img, Title, InfoWrapper, TextWrapper  } from './styles';
import { useNavigation } from '@react-navigation/native';
import { BuyerTabScreenProps } from '../../../types/navigation';
import { handleImg } from '../../../utils/handleImg';
import { Image, Dimensions } from 'react-native';


interface ICategoryCard {
  data: CategoryType;
  title: string;
 // handleTouch: (name: string) => void;
}

export const CategoryCard: React.FC<ICategoryCard> = ({data, title }) => {
  const navigation = useNavigation<BuyerTabScreenProps>();
	const [height, setHeight] = useState(0);
	const getSize = useCallback(async () => {
		try {
			await fetch(data.avatar).then(async response => {
				if (response.status === 404) {
					setHeight(75);
					return;
				}
				if (handleImg(data.avatar)) {
					await Image.getSize(data.avatar, (width: number, height: number) => {
						const ratio = (width * 100) / 75;
						setHeight(height * ratio);
					});
				} else {
					setHeight(75);
				}
			});
		} catch (e) {
			setHeight(75);
		}
	}, []);
	getSize();
	
  return (
    <Container  onPress={() => navigation.navigate('Products',{category:data.name, id:96, store:false})}>
   
    <InfoWrapper>
    
        <Image
          style={{
            width: 120,
            height: 120,
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
          }}
          source={{
            uri: data.pictures[0],
            // headers: { Authorization: 'Bearer ' },
            //priority: Image.priority.high,
          }}
          resizeMode={'cover'}
        />
     
      <TextWrapper>
        <Title>{data.name}</Title>
      </TextWrapper>
    </InfoWrapper>
  </Container>
  );
};


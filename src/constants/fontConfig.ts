import { Fonts } from 'react-native-paper/src/types';

export type FontsConfigProps = {
  web?: Fonts;
  ios?: Fonts;
  android?: Fonts;
};

export const fontConfig = (fonts: Fonts): FontsConfigProps => {
  return {
    web: fonts,
    ios: fonts,
    android: fonts,
  };
};

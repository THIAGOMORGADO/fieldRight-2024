import React from 'react';
import { ButtonText, Btn } from './styles';

type ButtonProps = {
	upper?: boolean;
	onPress?: () => void;
	marginLeft?: boolean;
	width?: number;
	textColor?: string;
	backgroundColor?: string;
	disabled?: boolean;
	children?: React.ReactNode | string;
};

export const Button: React.FC<ButtonProps> = ({
	children,
	width,
	upper,
	onPress,
	marginLeft,
	textColor,
	backgroundColor,
	disabled,
}) => {
	return (
		<Btn
			onPress={onPress}
			width={width}
			marginLeft={marginLeft}
			mode='contained'
			backgroundColor={backgroundColor}
			disabled={disabled}
		>
			<ButtonText upper={upper} textColor={textColor}>
				{children}
			</ButtonText>
			{/* <IconContainer /> */}
		</Btn>
	);
};

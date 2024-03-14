import { Button as PolarisButon, ButtonProps } from '@shopify/polaris';
import React from 'react';

interface Props extends Omit<ButtonProps, 'children'> {
  children: React.ReactNode;
}

const Button: React.FC<Props> = ({ children, ...props }) => {
  return <PolarisButon {...props}>{children as unknown as string}</PolarisButon>;
};

export default Button;

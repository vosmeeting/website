import { BadgeProps, Badge as PolarisBadge } from '@shopify/polaris';
import React from 'react';

interface Props extends Omit<BadgeProps, 'children'> {
  children: React.ReactNode;
}

export const Badge = ({ children, ...rest }: Props) => {
  //@ts-expect-error
  return <PolarisBadge {...rest}>{children as string}</PolarisBadge>;
};

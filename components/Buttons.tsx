import { Button as PolarisButon, ButtonProps } from '@shopify/polaris'

interface Props extends ButtonProps {}

const Button: React.FC<Props> = (props) => {
  return <PolarisButon {...props} />
}

export default Button

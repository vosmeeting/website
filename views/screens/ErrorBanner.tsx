import { Banner, Layout } from '@shopify/polaris';
import { FormError } from '@shopify/react-form';

export const ErrorBanner = ({ errors }: { errors: Error[] | FormError[] }) => {
  return errors.length > 0 ? (
    <Layout.Section>
      <Banner status="critical">
        <p>There were some issues with your form submission:</p>
        <ul>
          {errors.map(({ message }, index) => {
            return <li key={`${message}${index}`}>{message}</li>;
          })}
        </ul>
      </Banner>
    </Layout.Section>
  ) : null;
};

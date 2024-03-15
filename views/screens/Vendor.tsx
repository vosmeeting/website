import { Banner, Card, Form, FormLayout, Layout, List, Page, TextField } from '@shopify/polaris';
import {
  SubmitResult,
  getValues,
  notEmpty,
  numericString,
  useField,
  useForm
} from '@shopify/react-form';
import { omit } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import Button from '../components/Buttons';
import { Price } from '../../domain/Price';
import { apiService } from '../../infra/ApiService';
import { appConfig } from '../../domain/config/appConfig';

export function Vendor() {
  const route = useRouter();
  const {
    companyName = '',
    companyTelephone = '',
    email = '',
    amount = '',
    error = ''
  } = route.query as {
    companyName: string;
    companyTelephone: string;
    email: string;
    amount: string;
    error: string;
  };

  const schema = {
    companyName: useField({
      value: companyName,
      validates: [notEmpty('company name is required')]
    }),
    companyTelephone: useField({
      value: companyTelephone,
      validates: [
        notEmpty("phone number can't be empty"),
        (input) => {
          const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
          if (!phoneRegex.test(input)) {
            return 'please input a valid phone number';
          }
        }
      ]
    }),
    email: useField({
      value: email,
      validates: [
        (input) => {
          try {
            yup
              .string()
              .required('Company/Contact email is required')
              .email('please provide a valid email')
              .validateSync(input);
          } catch (e) {
            const error = e as Error;
            return error.message;
          }
        }
      ]
    }),
    amount: useField({
      value: amount,
      validates: [
        notEmpty('amount is required'),
        numericString('must be a valid amount: only numeric is accepted')
      ]
    })
  };

  const [remoteErrors, setRemoteErrors] = useState<Error[]>([]);

  useEffect(() => {
    if (error) setRemoteErrors([new Error(error)]);
  }, [error]);

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { fields, submit, submitting } = useForm({
    fields: schema,
    async onSubmit(form) {
      const item = {
        amount: Number(form.amount)
      };
      const vendor = omit(form, 'amount');

      try {
        await apiService.createVendorCheckoutSession({
          item,
          vendor
        });
      } catch (e) {
        setRemoteErrors([e as Error]);
        const result: SubmitResult = { status: 'fail', errors: [e as Error] };
        return result;
      }

      return { status: 'success' };
    }
  });

  const errorBanner =
    remoteErrors.length > 0 ? (
      <Banner status="critical" onDismiss={() => setRemoteErrors([])}>
        <p>There were some issues with your form submission:</p>
        <List>
          {remoteErrors.map(({ message }, index) => {
            return <List.Item key={`${message}${index}`}>{message}</List.Item>;
          })}
        </List>
      </Banner>
    ) : null;

  return (
    <Page
      title="Application	for	Commercial	Exhibits and	Sponsorship"
      subtitle={`5th Veterinary	Ophthalmic	Surgery	Meeting	&bull; ${appConfig.willHeld}`}
      additionalMetadata="Hyatt	Regency	O’Hare,	Rosemont,	IL"
      narrowWidth
    >
      <Card title="Company Contact Information" sectioned>
        <Layout>
          <Layout.Section>{errorBanner}</Layout.Section>
          <Layout.Section>
            <Form noValidate onSubmit={submit}>
              <FormLayout>
                <TextField
                  label="Company Name"
                  placeholder="Acme corp"
                  autoComplete="off"
                  {...fields.companyName}
                />
                <FormLayout.Group>
                  <TextField
                    label="Company Telephone"
                    placeholder="202-555-0124"
                    autoComplete="tel"
                    inputMode="tel"
                    {...fields.companyTelephone}
                  />
                  <TextField
                    label="Company/Contact Email"
                    placeholder="john@company.mail.com"
                    autoComplete="email"
                    {...fields.email}
                  />
                </FormLayout.Group>
                <FormLayout.Group></FormLayout.Group>
                <TextField
                  label="Amount"
                  inputMode="numeric"
                  type="number"
                  autoComplete="off"
                  {...fields.amount}
                />
              </FormLayout>
              <div className="mt-10 flex justify-center sm:justify-end">
                <Button submit loading={submitting}>
                  Proceed to payment {new Price(getValues(fields).amount).toDollar()}
                </Button>
              </div>
            </Form>
          </Layout.Section>
        </Layout>
      </Card>
    </Page>
  );
}

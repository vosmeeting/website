/* eslint-disable @typescript-eslint/unbound-method */
import * as yup from 'yup';
import {
  Banner,
  Button,
  Card,
  Checkbox,
  Form,
  FormLayout,
  Heading,
  Icon,
  Layout,
  Page,
  Select,
  TextField
} from '@shopify/polaris';
import { CustomerPlusMajor, CustomersMinor, MobileCancelMajor } from '@shopify/polaris-icons';
import {
  FormError,
  asChoiceField,
  notEmpty,
  useDynamicList,
  useField,
  useForm
} from '@shopify/react-form';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { COUNTRIES } from '../../utils/contry_codes';
import { apiService } from '../../infra/ApiService';
import { useParticipantQuota } from '../hooks/useParticipantQuota';
import { RegistrationTypeList } from '../components/RegistrationType';
import { Price } from '../../domain/Price';
import { SeatAvailabilityData } from '../../domain/databaseService';
import { appConfig } from '../../domain/config/appConfig';
import { ErrorBanner } from './ErrorBanner.1';
import { Badge } from '../components/Badge';
import { secretUrlService } from '../../infra/SecretUrlService';
import { ParticipantInformationDTO } from '../../types';
import { getAvailableSeats } from '../../use-cases/getAvailableSeats';

let num = 2;
function personalInformationFactory(
  props: Partial<ParticipantInformationDTO>
): ParticipantInformationDTO {
  return {
    id: (num++).toString(),
    country: props.country || '',
    email: props.email || '',
    fullName: props.fullName || '',
    organization: props.organization || '',
    registrationType: props.registrationType || ''
  };
}

export const emailValidation = (email: string) => {
  {
    try {
      yup
        .string()
        .required('email is required')
        .email('please provide a valid email')
        .validateSync(email);
    } catch (e) {
      const error = e as Error;
      return error.message;
    }
  }
};
export type Props = {
  data: SeatAvailabilityData;
  isSecretUrl: boolean;
};

export function Register({ data }: Props) {
  const route = useRouter();
  const [remoteErrors, setRemoteErrors] = useState<FormError[] | null>(null);
  const info = useParticipantQuota(data);

  const { error = '', secretUrlId = '' } = route.query as {
    error: string;
    secretUrlId?: string;
  };
  const secretUrlInfo = useQuery(
    secretUrlId,
    () => secretUrlService.validateSecretUrl(secretUrlId),
    {
      initialData: false
    }
  );
  const isSecretUrl = secretUrlInfo.data;

  const personalInformations = useDynamicList(
    {
      list: [
        {
          id: '1',
          fullName: 'John',
          organization: '',
          email: 'john.doe@mail.com',
          country: 'US',
          registrationType: appConfig.defaultRegistrationType.value
        }
      ],
      validates: {
        email: [emailValidation],
        organization: [notEmpty('clinic/school/company name is required')],
        country: [notEmpty('country is required')],
        fullName: [notEmpty('your name is required')],
        registrationType: [notEmpty('Registration type is required')]
      }
    },
    personalInformationFactory
  );
  const registerForSelf = useField(true);
  const firstPersonInformation = personalInformations.fields[0];
  const form = useForm({
    fields: {
      persons: personalInformations.fields,
      registerForSelf,
      registrant: {
        name: useField(
          registerForSelf.value
            ? firstPersonInformation.fullName.value
            : {
                value: '',
                validates: [notEmpty('Registrant name is required')]
              },
          [registerForSelf.value, firstPersonInformation.fullName.value]
        ),
        email: useField(
          registerForSelf.value
            ? firstPersonInformation.email.value
            : {
                value: '',
                validates: [emailValidation]
              },
          [registerForSelf.value, firstPersonInformation.email.value]
        )
      }
    },
    onSubmit: async (form) => {
      let remoteErrors: FormError[] = [];
      try {
        await apiService.createParticipantsCheckoutSession({
          participants: form.persons,
          registrant: form.registrant,
          secretUrlId
        });
      } catch (e) {
        remoteErrors.push(e as FormError);
        console.error(e);
      }
      if (remoteErrors.length > 0) {
        setRemoteErrors([remoteErrors].map((e) => new Error('there was some network issue')));
        return { status: 'fail', errors: remoteErrors };
      }

      return { status: 'success' };
    }
  });

  const totalPrice = useMemo(() => {
    return form.fields.persons.reduce((totalPrice, person) => {
      const price = appConfig.registrationTypes.find(
        (r) => r.value! === person!.registrationType.value
      )!.price;

      return totalPrice + price;
    }, 0);
  }, [form.fields.persons]);

  // redirection error from Stripe's page
  useEffect(() => {
    if (error) setRemoteErrors([new Error(error)]);
    const timeout = setTimeout(() => {
      if (error) {
        setRemoteErrors(null);
        route.push(route.pathname);
      }
    }, 3000);
    return () => clearTimeout(timeout);
  }, [error]);

  if (secretUrlInfo.isLoading) {
    return 'loading..';
  }

  return (
    <Page
      title={`Participant Registration`}
      titleMetadata={
        <Badge size="small" status="success">
          <span className="flex items-center gap-x-2">
            <Icon source={CustomersMinor} />
            {info.data ? (
              <p className="text-sm font-bold">{`${info.data.count}/${info.data.maxSeat}`}</p>
            ) : (
              '...'
            )}
          </span>
        </Badge>
      }
      subtitle={'5th Veterinary	Ophthalmic	Surgery	Meeting • ' + `${appConfig.willHeld}`}
      additionalMetadata="Hyatt	Regency	O’Hare,	Rosemont,	IL"
    >
      <Layout>
        {remoteErrors && <ErrorBanner errors={remoteErrors} />}
        <Layout.Section>
          {info.data && info.data.count >= info.data.maxSeat && !isSecretUrl && (
            <Banner status="info"> Sorry we sold out!</Banner>
          )}
        </Layout.Section>
        <Layout.Section>
          <Card
            sectioned
            title="Personal Information"
            primaryFooterAction={{
              content: 'register ' + new Price(totalPrice).toDollar(),
              onAction: form.submit,
              loading: form.submitting,
              disabled: info.data ? info.data.count >= info.data.maxSeat && !isSecretUrl : true
            }}
{/*             secondaryFooterActions={[
              {
                content: 'add more participant',
                icon: CustomerPlusMajor,
                onAction: () =>
                  personalInformations.addItem({
                    email: 'participant@domain.com',
                    registrationType: appConfig.defaultRegistrationType.value,
                    country: 'US'
                  })
              }
            ]} */}
          >
            <Form onSubmit={form.submit}>
              {personalInformations.fields.map((field, i, arr) => {
                const isMultipleParticipants = arr.length > 1;
                const firsParticipant = i === 0;
                const registerForSelf = form.fields.registerForSelf.value;
                return (
                  <div
                    className={classNames('participant-container relative my-6 rounded-lg', {
                      'border p-4 shadow-sm': isMultipleParticipants
                    })}
                    key={i}
                  >
                    {isMultipleParticipants && (
                      <div className="absolute right-0 top-0 p-4">
                        <Button
                          onClick={() => personalInformations.removeItem(i)}
                          plain={true}
                          icon={<Icon source={MobileCancelMajor} />}
                        />
                      </div>
                    )}
                    <FormLayout>
                      {isMultipleParticipants && <Heading>Participant {i + 1}</Heading>}
                      <RegistrationTypeList
                        choiceList={appConfig.registrationTypes}
                        selected={field.registrationType.value}
                        onChange={field.registrationType.onChange}
                        errorMessage={field.registrationType.error}
                      />

                      <FormLayout.Group>
                        <TextField
                          autoComplete="fullname"
                          label={
                            registerForSelf === true && !isMultipleParticipants
                              ? 'Name'
                              : 'Participant Name'
                          }
                          {...field.fullName}
                        />
                        <TextField
                          autoComplete="email"
                          label={
                            registerForSelf === true && !isMultipleParticipants
                              ? 'Email'
                              : 'Participant Email'
                          }
                          {...field.email}
                        />
                      </FormLayout.Group>
                      <FormLayout.Group>
                        <TextField
                          autoComplete="company"
                          label="Clinic/School/Company"
                          {...field.organization}
                        />

                        <Select
                          label="Country"
                          options={COUNTRIES.map(({ country, abbreviation }) => ({
                            label: country,
                            value: abbreviation
                          }))}
                          {...field.country}
                        />
                      </FormLayout.Group>

                      {firsParticipant && form.fields.registerForSelf.value === false && (
                        <FormLayout.Group
                          //@ts-ignore
                          title={<div className="text-base font-semibold">Registrant Details</div>}
                        >
                          <TextField
                            autoComplete="fullname"
                            label="Name"
                            {...form.fields.registrant.name}
                          />
                          <TextField
                            autoComplete="email"
                            label="Email"
                            {...form.fields.registrant.email}
                          />
                        </FormLayout.Group>
                      )}
                      {firsParticipant && (
                        <FormLayout.Group>
                          <Checkbox
                            label="Register for self"
                            {...asChoiceField(form.fields.registerForSelf)}
                          />
                        </FormLayout.Group>
                      )}
                    </FormLayout>
                  </div>
                );
              })}
            </Form>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Heading>Cancellation Policy for VOSM 2024:</Heading>
          <p className="italic">
            Cancellations received by May 22nd will receive a full refund less a 10% administrative
            fee. Cancellations received by Jun 22nd will receive a 50% refund. No cancellations will
            be refunded after Jun 22nd. All cancellations must be received in writing via email. No
            refunds for no-shows
          </p>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

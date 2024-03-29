import {
  Banner,
  Button,
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  Stack,
  TextField
} from '@shopify/polaris';
import { FormError, notEmpty, useField, useForm } from '@shopify/react-form';
import { useState } from 'react';
import Illustration from './ComingSoonIllustration';
import { Title } from './typography';
import { apiService } from '../../infra/ApiService';

const ComingSoon = () => {
  const [status, setStatus] = useState<'idle' | 'submitted' | 'submitting' | 'error'>('idle');
  const email = useField({
    value: '',
    validates: [notEmpty("email can't be empty!")]
  });
  const name = useField('');
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { submit, submitErrors } = useForm({
    fields: {
      email,
      name
    },
    async onSubmit(form) {
      setStatus('submitting');
      try {
        await apiService.saveUserToBeNotified(form.email, form.name);
        setStatus('submitted');
        return { status: 'success' } as const;
      } catch (e) {
        setStatus('error');
        return { status: 'fail', errors: [e] as FormError[] };
      }
    }
  });
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            {status === 'error' && (
              <Stack.Item>
                <Banner
                  title="something went wrong"
                  status="warning"
                  onDismiss={() => setStatus('idle')}
                >
                  {submitErrors[0]?.message}
                </Banner>
              </Stack.Item>
            )}
            {status === 'submitted' && (
              <Stack.Item>
                <Banner onDismiss={() => setStatus('idle')} title="Thank you!" status="success">
                  We will notify you when the feature is ready
                </Banner>
              </Stack.Item>
            )}
            <Stack distribution="fill">
              <Stack.Item>
                <div className="pb-4">
                  <Title>Coming Soon</Title>
                </div>
                <div className="flex items-center justify-between">
                  <Form onSubmit={submit}>
                    <FormLayout>
                      <FormLayout.Group>
                        <TextField
                          autoComplete="email"
                          label={null}
                          placeholder="Your email"
                          type="email"
                          {...email}
                        />
                        <TextField
                          {...name}
                          placeholder="Your name"
                          label={null}
                          autoComplete="name"
                        ></TextField>
                      </FormLayout.Group>

                      <Button primary loading={status === 'submitting'} onClick={submit}>
                        Notify Me
                      </Button>
                    </FormLayout>
                  </Form>
                </div>
              </Stack.Item>
              <Stack.Item>
                <Illustration />
              </Stack.Item>
            </Stack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ComingSoon;

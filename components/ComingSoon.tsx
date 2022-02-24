import {
  Banner,
  Button,
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  Stack,
  TextField,
} from '@shopify/polaris'
import { notEmpty, useField, useForm } from '@shopify/react-form'
import axios from 'axios'
import Illustration from './ComingSoonIllustration'
import { Title } from './typography'

const ComingSoon = () => {
  const email = useField({
    value: '',
    validates: [notEmpty("email can't be empty!")],
  })
  const name = useField('')
  const { submit, submitErrors, submitting } = useForm({
    fields: {
      email,
    },
    async onSubmit(form) {
      try {
        await axios.post('api/create-stripe-customer', form)
        return { status: 'success' }
      } catch (e) {
        return { status: 'fail', errors: [e] }
      }
    },
  })
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            {submitErrors.length > 0 && (
              <Stack.Item>
                <Banner title="something went wrong" status="warning">
                  {submitErrors[0]?.message}
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

                      <Button primary loading={submitting} onClick={submit}>
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
  )
}

export default ComingSoon

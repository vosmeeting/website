import {
  Card,
  ChoiceList,
  Form,
  FormLayout,
  Heading,
  Layout,
  List,
  Page,
  TextContainer,
  TextField,
  TextFieldProps,
} from '@shopify/polaris'
import { useCallback, useState } from 'react'
import Button from '../components/Buttons'
import {
  BoothLocations,
  GeneralSupport,
  MarketingOpportunities,
  SponsorshipPreferences,
} from './const'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup
  .object({
    companyName: yup.string().required(),
    companyTelephone: yup.number().positive().integer().required(),
    address: yup.string(),
    fax: yup.string().optional(),
    contactName: yup.string(),
    email: yup.string().email(),
    state: yup.string(),
    city: yup.string(),
  })
  .required()

export default function Sponsor() {
  const handleSubmit = useCallback((_event) => setUrl(''), [])

  const fields: TextFieldProps[] = [
    { name: 'companyName', label: 'Company Name' },
    { name: 'companyTelephone', label: 'Company Telephone', type: 'number' },
    { name: 'address', label: 'Address' },
    { name: 'contactName', label: "Contact's Name" },
    { name: 'fax', label: 'Fax', type: 'number' },
    { name: 'telephone', label: 'Telephone', type: 'number' },
    { name: 'companyTelephone', label: 'Company Telephone', type: 'number' },
    { label: 'City/State/Zip' },
    { label: 'Website Address', placeholder: 'www.example.com', type: 'url' },
  ]
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card title="Online store dashboard" sectioned>
            <Form noValidate onSubmit={handleSubmit}>
              <FormLayout>
                <FormLayout.Group>
                  {fields.map((f, i) => {
                    return (
                      <TextField
                        key={i}
                        label={f.label}
                        placeholder={f.placeholder}
                      />
                    )
                  })}
                </FormLayout.Group>

                <TextContainer>
                  <Heading>Booth layout options</Heading>
                  <List>
                    <List.Item>
                      Previous sponsors have priority in choosing booth space
                    </List.Item>
                    <List.Item>
                      Companies exhibiting at the exhibitor hall can get 2
                      booths max
                    </List.Item>
                    <List.Item>
                      Companies exhibiting in the lecture hall can get 1 booth
                      max
                    </List.Item>
                    <List.Item>Companies cannot share booths</List.Item>
                    <List.Item>
                      Registration fee is per booth and includes only one
                      representative; additional representative = $350 [includes
                      daily breakfast+ lunch and reception with hors D'oeuvres].
                    </List.Item>
                    <List.Item>
                      Booths are small. The limit is 2 reps per booth
                    </List.Item>
                  </List>
                </TextContainer>
                <FormLayout.Group
                  title={
                    'Booth Options (refer to booth floor layout sent over email)'
                  }
                >
                  <ChoiceList
                    title={<b>Options:</b>}
                    selected={['1st']}
                    choices={['1st', '2nd', '3rd', '4th'].map((c) => ({
                      label: `${c} option`,
                      value: c,
                    }))}
                  />
                  <ChoiceList
                    title={<b>Locations</b>}
                    selected={[]}
                    choices={BoothLocations.map(({ name, price }, i) => ({
                      label: name,
                      helpText: price.toDollar(),
                      value: name,
                    }))}
                  />
                </FormLayout.Group>
                <FormLayout.Group condensed>
                  <ChoiceList
                    selected={['0']}
                    title={<b>Sponsorship Prefferences</b>}
                    choices={SponsorshipPreferences.map((s, i) => {
                      return {
                        label: s.name,
                        helpText:
                          `${s.price.toDollar()}` +
                          (s.disc ? `, ${s.disc}% booth disc` : null),
                        value: i.toString(),
                      }
                    })}
                  />
                  <ChoiceList
                    selected={['0']}
                    title={<b>General support</b>}
                    choices={GeneralSupport.map((s, i) => {
                      return {
                        disabled: s.name.includes('*'), // disable exclusive package for now
                        label: s.name,
                        helpText: s.price.toDollar(),
                        value: i.toString(),
                      }
                    })}
                  />

                  <ChoiceList
                    title={<b>Marketing Opportunities</b>}
                    selected={['0']}
                    choices={MarketingOpportunities.map((o, i) => {
                      return {
                        disabled: o.name.includes('*'), // disable exclusive package for now
                        label: o.name,
                        helpText: o.price.toDollar(),
                        value: i.toString(),
                      }
                    })}
                  />
                </FormLayout.Group>
              </FormLayout>
            </Form>
            <TextContainer>
              <p className='text-right text-slate-600 italic'>*=exclusive sponsorship</p>
            </TextContainer>
            <Button type="submit" className={'px-4'}>
              Proceed to Payment
            </Button>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )
}

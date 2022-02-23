/* eslint-disable react/no-unescaped-entities */
import { Banner, Layout, Page } from '@shopify/polaris'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const router = useRouter()
  return (
    <Page>
      <Head>
        <title>Veterinary Opthalmic Surgery Meeting</title>
        <meta
          name="description"
          content="We are excited to announce the 3rd Veterinary Ophthalmic Surgery Meeting. This long awaited event will be an innovative meeting, with a dynamic format developed to encourage a candid debate among Veterinary Ophthalmologists with interests in Surgery."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page>
        <Layout>
          <Layout.Section>
            
              <Banner
                title="Oops! Your payment was failed."
                status="critical"
                action={{ content: 'Back to sponsor form', onAction: () => router.push('/become-a-sponsor') }}
              >
                <p></p>
              </Banner>
            
          </Layout.Section>
        </Layout>
      
    </Page>
    </Page>
  )
}

export default Home

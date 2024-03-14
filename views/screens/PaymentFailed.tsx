import { Banner, Layout, Page } from '@shopify/polaris';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

export const PaymentFailed: NextPage = () => {
  // todo: handle error from sponsor and participant page
  // right now it only handles from vendor
  const router = useRouter();
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
              action={{
                content: 'Back to vendor form',
                onAction: () => router.push('/vendor')
              }}
            >
              <p></p>
            </Banner>
          </Layout.Section>
        </Layout>
      </Page>
    </Page>
  );
};
